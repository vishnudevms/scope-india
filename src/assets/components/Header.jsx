import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import '../css/Header.css';
import { toast } from 'react-toastify';

const TEMP_PROFILE_IMAGE = "/images/temp-profile-avatar.png"; 

let Header = () => {
    const [loginOpen, setLoginOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [_userEmail, setUserEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null); // null means no uploaded image
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate(); // <-- Add this line

    // Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/profile', {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setIsAuthenticated(true);
                    setUserEmail(data.email || '');
                    setProfileImage(data.profileImageUrl || null);
                } else {
                    setIsAuthenticated(false);
                    setUserEmail('');
                    setProfileImage(null);
                }
            } catch {
                setIsAuthenticated(false);
                setUserEmail('');
                setProfileImage(null);
            }
        };
        checkSession();
    }, []);

    // Accept profileImageUrl from Login component
    const handleLogin = (email, password, keepMeSignedIn, profileImageUrl) => {
        setIsAuthenticated(true);
        setUserEmail(email);
        setLoginOpen(false);
        if (profileImageUrl) {
            setProfileImage(profileImageUrl);
        } else {
            setProfileImage(null);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setIsAuthenticated(false);
        setUserEmail('');
        setProfileImage(null);
        toast.info('Logged out successfully!');
        navigate('/'); // <-- Redirect to home page after logout
    };

    return (
        <>
            <Login open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
            <section id="container_header">
                <div>
                    <div id="container_logo">
                        <Link to="/" className="current">
                            <img
                                id="logo"
                                src="/images/scopeindia-logo.webp"
                                alt="SCOPE INDIA logo"
                                title="SCOPE INDIA, Center for Software, Networking, and Cloud education from Kerala and Tamil Nadu"
                            />
                        </Link>
                    </div>
                    <div id="container_google_star">
                        <Link to="/scope-india-reviews">
                            <img
                                id="google_star"
                                src="/images/google-rating-scope-india.webp"
                                alt="google-rating-scope-india"
                                width="200px"
                                title="SCOPE INDIA is a 5 star rated institute"
                            />
                        </Link>
                    </div>
                </div>
                <div id="mobile-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    &#9776;
                </div>
                <div style={{ clear: "both" }}></div>
                <nav id="main_navigation">
                    <ul className={mobileMenuOpen ? "mobile" : "desktop"}>
                        <li>
                            <NavLink to="/" end className={({ isActive }) => isActive ? "current" : ""}>HOME</NavLink>
                        </li>
                        <li>
                            <NavLink to="/courses" className={({ isActive }) => isActive ? "current" : ""}>COURSES</NavLink>
                        </li>
                        <li>
                            <NavLink to="/registration" className="registration_link" >REGISTRATION</NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className={({ isActive }) => isActive ? "current" : ""}>ABOUT US</NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact" className={({ isActive }) => isActive ? "current" : ""}>CONTACT US</NavLink>
                        </li>
                        <li>
                            {!isAuthenticated ? (
                                <button
                                    className="login-btn-nav"
                                    onClick={() => setLoginOpen(true)}
                                >
                                    LOGIN
                                </button>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Link to="/profile" style={{ display: "flex", alignItems: "center" }}>
                                        <img
                                            src={profileImage || TEMP_PROFILE_IMAGE}
                                            alt="Profile"
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "1px solid #ccc",
                                                background: "#f5f5f5",
                                                cursor: "pointer",
                                                marginRight: "10px"
                                            }}
                                        />
                                    </Link>
                                    <button
                                        className="login-btn-nav"
                                        onClick={handleLogout}
                                    >
                                        LOGOUT
                                    </button>
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>
            </section>
        </>
    );
};

export default Header;
