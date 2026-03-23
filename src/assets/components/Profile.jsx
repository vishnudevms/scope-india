import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Profile.css";

const TEMP_PROFILE_IMAGE = "/images/temp-profile-avatar.png";
const PREFERRED_TIMINGS_OPTIONS = [
  "Between 8am - 10am",
  "Between 9am - 1pm",
  "Between 1pm - 6pm",
  "Between 6pm - 10pm"
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState("");
  const [removeSuccess, setRemoveSuccess] = useState(false);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Courses from DB
  const [availableCourses, setAvailableCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/profile", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await res.json();
        setUser(data.user || data);
      } catch (err) {
        setError(err.message || "Error loading profile.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProfileImage = async () => {
      try {
        const res = await fetch("/api/profile/image", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          } else {
            setProfileImage(null);
          }
        }
      } catch {
        setProfileImage(null);
      }
    };

    fetchUser();
    fetchProfileImage();
  }, []);

  // Fetch available courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setAvailableCourses(data);
      } catch {
        setAvailableCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadSuccess(false);
      setUploadError("");
    }
  };

  const handleImageUpload = async () => {
    if (!profileImageFile) {
      setUploadError("Please select an image to upload.");
      return;
    }
    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append("profileImage", profileImageFile);

      const res = await fetch("/api/profile/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to upload image.");
      }

      const imageRes = await fetch("/api/profile/image", {
        credentials: "include",
      });
      if (imageRes.ok) {
        const imageData = await imageRes.json();
        setProfileImage(imageData.profileImage);
      }

      setUploadSuccess(true);
      setProfileImageFile(null);
      setShowUpload(false);
    } catch (err) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setRemoving(true);
    setRemoveError("");
    setRemoveSuccess(false);
    try {
      const res = await fetch("/api/profile/remove-image", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to remove image.");
      }
      setProfileImage(null);
      setRemoveSuccess(true);
      setProfileImageFile(null);
      setShowUpload(false);
    } catch (err) {
      setRemoveError(err.message || "Remove failed.");
    } finally {
      setRemoving(false);
    }
  };

  // Edit mode handlers
  const handleEdit = () => {
    setEditData({
      ...user,
      reg_course: Array.isArray(user.reg_course)
        ? [...user.reg_course]
        : user.reg_course
        ? [user.reg_course]
        : [""],
      reg_preferred_timings: Array.isArray(user.reg_preferred_timings)
        ? user.reg_preferred_timings[0] || ""
        : user.reg_preferred_timings || "",
    });
    setEditMode(true);
    setSaveError("");
    setSaveSuccess(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData(null);
    setSaveError("");
    setSaveSuccess(false);
  };

  const handleEditChange = (e, field) => {
    setEditData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCourseChange = (idx, value) => {
    setEditData((prev) => {
      const courses = [...prev.reg_course];
      courses[idx] = value;
      return { ...prev, reg_course: courses };
    });
  };

  const handleAddCourse = () => {
    setEditData((prev) => ({
      ...prev,
      reg_course: [...prev.reg_course, ""],
    }));
  };

  const handleRemoveCourse = (idx) => {
    setEditData((prev) => {
      const courses = [...prev.reg_course];
      courses.splice(idx, 1);
      return { ...prev, reg_course: courses };
    });
  };

  // Preferred timings radio handler (single select)
  const handlePreferredTimingChange = (timing) => {
    setEditData((prev) => ({
      ...prev,
      reg_preferred_timings: timing,
    }));
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      // Prepare data to send (exclude profile image and full name)
      const {
        reg_full_name: _reg_full_name,
        ...fieldsToUpdate
      } = editData;

      // If reg_course is array, send as array, else as string
      fieldsToUpdate.reg_course =
        Array.isArray(fieldsToUpdate.reg_course) && fieldsToUpdate.reg_course.length === 1
          ? fieldsToUpdate.reg_course[0]
          : fieldsToUpdate.reg_course;

      // Preferred timings: send as string (single select)
      fieldsToUpdate.reg_preferred_timings = fieldsToUpdate.reg_preferred_timings || "";

      const res = await fetch("/api/profile/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldsToUpdate),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errData = {};
        if (contentType && contentType.includes("application/json")) {
          errData = await res.json();
        } else {
          const text = await res.text();
          throw new Error(text || "Failed to update profile.");
        }
        throw new Error(errData.message || "Failed to update profile.");
      }

      setUser((prev) => ({
        ...prev,
        ...fieldsToUpdate,
      }));
      setEditMode(false);
      setEditData(null);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err.message || "Save failed.");
    } finally {
      setSaveLoading(false);
    }
  };

  const hasProfileImage = !!profileImage;

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Profile</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <h2>Profile</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Profile</h2>
        <p>No user data found.</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header-row">
        <div className="profile-image-section">
          <div className="profile-image-preview">
            <img src={profileImage || TEMP_PROFILE_IMAGE} alt="Profile" />
          </div>
          {showUpload ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="profile-image-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="profile-image-upload" className="profile-image-upload-btn">
                Choose Image
              </label>
              <button
                className="profile-image-upload-btn"
                style={{ marginTop: 8 }}
                onClick={handleImageUpload}
                disabled={uploading || !profileImageFile}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
              <button
                className="profile-image-upload-btn"
                style={{ marginTop: 8, background: "#888" }}
                onClick={() => {
                  setShowUpload(false);
                  setProfileImageFile(null);
                  setUploadError("");
                  setUploadSuccess(false);
                }}
              >
                Cancel
              </button>
              {uploadError && (
                <div style={{ color: "red", marginTop: 6 }}>{uploadError}</div>
              )}
              {uploadSuccess && (
                <div style={{ color: "green", marginTop: 6 }}>Image uploaded successfully!</div>
              )}
            </>
          ) : (
            <>
              <button
                className="profile-image-upload-btn"
                style={{ marginTop: 8 }}
                onClick={() => setShowUpload(true)}
              >
                {hasProfileImage ? "Update Profile Picture" : "Upload Profile Picture"}
              </button>
              {hasProfileImage && (
                <button
                  className="profile-image-upload-btn"
                  style={{ marginTop: 8, background: "#e74c3c" }}
                  onClick={handleRemoveImage}
                  disabled={removing}
                >
                  {removing ? "Removing..." : "Remove Profile Picture"}
                </button>
              )}
              {removeError && (
                <div style={{ color: "red", marginTop: 6 }}>{removeError}</div>
              )}
              {removeSuccess && (
                <div style={{ color: "green", marginTop: 6 }}>Profile picture removed!</div>
              )}
            </>
          )}
        </div>
        <div className="profile-fullname-row">
          <span className="profile-fullname-label">Full Name:</span>
          <span className="profile-fullname-value">{user.reg_full_name}</span>
        </div>
      </div>

      <div className="profile-details">
        {editMode ? (
          <>
            {/* ... other fields ... */}
            
            {/* ... rest of your fields and buttons ... */}
            <div className="profile-details-row">
              <strong>Date of Birth:</strong>
              <input
                type="date"
                value={editData.reg_date_of_birth || ""}
                onChange={(e) => handleEditChange(e, "reg_date_of_birth")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Gender:</strong>
              <select
                value={editData.reg_gender || ""}
                onChange={(e) => handleEditChange(e, "reg_gender")}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="profile-details-row">
              <strong>Qualification:</strong>
              <input
                type="text"
                value={editData.reg_qualification || ""}
                onChange={(e) => handleEditChange(e, "reg_qualification")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Mobile Number:</strong>
              <input
                type="text"
                value={editData.reg_mobile_number || ""}
                onChange={(e) => handleEditChange(e, "reg_mobile_number")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Email:</strong>
              <span style={{ marginLeft: 8 }}>{editData.reg_email}</span>
            </div>
            <div className="profile-details-row">
              <strong>Guardian Name:</strong>
              <input
                type="text"
                value={editData.reg_guardian_name || ""}
                onChange={(e) => handleEditChange(e, "reg_guardian_name")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Guardian Occupation:</strong>
              <input
                type="text"
                value={editData.reg_guardian_occupation || ""}
                onChange={(e) => handleEditChange(e, "reg_guardian_occupation")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Guardian's Mobile:</strong>
              <input
                type="text"
                value={editData.reg_guardians_mobile || ""}
                onChange={(e) => handleEditChange(e, "reg_guardians_mobile")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Course(s):</strong>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {editData.reg_course.map((course, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <select
                      value={course}
                      onChange={(e) => handleCourseChange(idx, e.target.value)}
                      disabled={coursesLoading}
                    >
                      <option value="">Select Course</option>
                      {availableCourses && availableCourses.map((group, groupIdx) => (
                        <optgroup key={groupIdx} label={group.title}>
                          {group.subCourses && group.subCourses.map((sub, subIdx) => (
                            <option key={subIdx} value={sub}>{sub}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {editData.reg_course.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(idx)}
                        style={{
                          background: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          borderRadius: "3px",
                          padding: "2px 8px",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddCourse}
                  style={{
                    background: "#3498db",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    padding: "2px 8px",
                    marginTop: "4px",
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                  disabled={coursesLoading}
                >
                  {coursesLoading ? "Loading..." : "Add Course"}
                </button>
              </div>
            </div>
            <div className="profile-details-row">
              <strong>Training Mode:</strong>
              <input
                type="text"
                value={editData.reg_training_mode || ""}
                onChange={(e) => handleEditChange(e, "reg_training_mode")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Training Location:</strong>
              <input
                type="text"
                value={editData.reg_training_location || ""}
                onChange={(e) => handleEditChange(e, "reg_training_location")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Preferred Timings:</strong>
              <select
                name="reg_preferred_timings"
                value={editData.reg_preferred_timings || ""}
                onChange={(e) => handlePreferredTimingChange(e.target.value)}
                style={{ minWidth: "220px", padding: "4px" }}
              >
                <option value="">Select Preferred Timing</option>
                {PREFERRED_TIMINGS_OPTIONS.map((timing) => (
                  <option key={timing} value={timing}>
                    {timing}
                  </option>
                ))}
              </select>
            </div>
            <div className="profile-details-row">
              <strong>Address:</strong>
              <input
                type="text"
                value={editData.reg_address || ""}
                onChange={(e) => handleEditChange(e, "reg_address")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Country:</strong>
              <input
                type="text"
                value={editData.reg_country || ""}
                onChange={(e) => handleEditChange(e, "reg_country")}
              />
            </div>
            <div className="profile-details-row">
              <strong>State:</strong>
              <input
                type="text"
                value={editData.reg_state || ""}
                onChange={(e) => handleEditChange(e, "reg_state")}
              />
            </div>
            <div className="profile-details-row">
              <strong>City:</strong>
              <input
                type="text"
                value={editData.reg_city || ""}
                onChange={(e) => handleEditChange(e, "reg_city")}
              />
            </div>
            <div className="profile-details-row">
              <strong>Zip:</strong>
              <input
                type="text"
                value={editData.reg_zip || ""}
                onChange={(e) => handleEditChange(e, "reg_zip")}
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <button
                className="profile-image-upload-btn"
                onClick={handleSave}
                disabled={saveLoading}
                style={{ marginRight: 8 }}
              >
                {saveLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="profile-image-upload-btn"
                style={{ background: "#888" }}
                onClick={handleCancelEdit}
                disabled={saveLoading}
              >
                Cancel
              </button>
              {saveError && (
                <div style={{ color: "red", marginTop: 6 }}>{saveError}</div>
              )}
              {saveSuccess && (
                <div style={{ color: "green", marginTop: 6 }}>Profile updated!</div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="profile-details-row"><strong>Date of Birth:</strong> {user.reg_date_of_birth}</div>
            <div className="profile-details-row"><strong>Gender:</strong> {user.reg_gender}</div>
            <div className="profile-details-row"><strong>Qualification:</strong> {user.reg_qualification}</div>
            <div className="profile-details-row"><strong>Mobile Number:</strong> {user.reg_mobile_number}</div>
            <div className="profile-details-row"><strong>Email:</strong> {user.reg_email}</div>
            <div className="profile-details-row"><strong>Guardian Name:</strong> {user.reg_guardian_name}</div>
            <div className="profile-details-row"><strong>Guardian Occupation:</strong> {user.reg_guardian_occupation}</div>
            <div className="profile-details-row"><strong>Guardian's Mobile:</strong> {user.reg_guardians_mobile}</div>
            <div className="profile-details-row">
              <strong>Course(s):</strong>{" "}
              {Array.isArray(user.reg_course)
                ? user.reg_course.join(", ")
                : user.reg_course}
            </div>
            <div className="profile-details-row"><strong>Training Mode:</strong> {user.reg_training_mode}</div>
            <div className="profile-details-row"><strong>Training Location:</strong> {user.reg_training_location}</div>
            <div className="profile-details-row">
              <strong>Preferred Timings:</strong>{" "}
              {user.reg_preferred_timings}
            </div>
            <div className="profile-details-row"><strong>Address:</strong> {user.reg_address}</div>
            <div className="profile-details-row"><strong>Country:</strong> {user.reg_country}</div>
            <div className="profile-details-row"><strong>State:</strong> {user.reg_state}</div>
            <div className="profile-details-row"><strong>City:</strong> {user.reg_city}</div>
            <div className="profile-details-row"><strong>Zip:</strong> {user.reg_zip}</div>
            <div style={{ marginTop: 16 }}>
              <button
                className="profile-image-upload-btn"
                onClick={handleEdit}
              >
                Edit
              </button>
              {saveSuccess && (
                <div style={{ color: "green", marginTop: 6 }}>Profile updated!</div>
              )}
            </div>
          </>
        )}
      </div>
      <Link to="/" className="profile-back-btn">
        Back to Home
      </Link>
    </div>
  );
};

export default Profile;
