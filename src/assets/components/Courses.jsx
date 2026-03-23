import '../css/Courses.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

let Courses = () => {
    const [courses, setCourses] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cached = sessionStorage.getItem('courses');
        if (cached) {
            setCourses(JSON.parse(cached));
        } else {
            fetch('/api/courses')
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch courses");
                    return res.json();
                })
                .then(data => {
                    setCourses(data);
                    sessionStorage.setItem('courses', JSON.stringify(data));
                })
                .catch(err => {
                    console.error('Error fetching courses:', err);
                    setError('Failed to connect to the server. Please ensure the backend is running.');
                });
        }
    }, []);

    if (error) return <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>{error}</div>;
    if (!courses) return <div>Loading...</div>;
    return (
        <>
		<title>Learn Data Science, AI, Software, Networking, DevOps &amp; Cloud Courses</title>
        <section id="container_page_intro">
            <div>
                <h1>Courses at SCOPE&nbsp;INDIA</h1>
                <h2>Center for Software, Networking, &amp; Cloud Education</h2>
                <h3>
                    One of India's best Training destinations for Software, Networking, DevOps and Cloud Computing courses with 18 years of Industrial experience. Over 1,000 students find their dream careers each year, and we have assisted more than 15,000 students so far.
                </h3>
            </div>
        </section>
        {courses.map((course, i) => (
            <div key={i}>
                <div id="course_header">
                    <h2>{course.title}</h2>
                </div>
                <section id="course_head_container">
                    {course.subCourses.map((sub, idx) => (
                        <Link to={`/courses/${sub.toLowerCase().replace(/[,/\s&]+/g, '-')}`} key={idx}>
                            <h3>{sub}</h3>
                        </Link>
                    ))}
                </section>
            </div>
        ))}
        </>
    );
};
export default Courses;
