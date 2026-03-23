import { useEffect, useState } from 'react';
import { Link,useLocation } from 'react-router-dom';
import '../css/Icons.css';

let Icons = () => {
    const [showUpButton, setShowUpButton] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setShowUpButton(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const showBackButton = /^\/courses\/[^/]+$/.test(location.pathname);
    return (
        <>
            {showUpButton && (
                <div id="up_button" onClick={scrollToTop} style={{ display: 'block' }}>
                    <svg width="24" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"></path>
                    </svg>
                </div>
            )}
            <div id="call_float_icons">
                <a href="tel:+919745936073" title="Call SCOPE INDIA in just a click!">
                    <img src="/images/callnow-scope-india.webp" alt="Call SCOPE INDIA" />
                </a>
                <a href="https://wa.me/+919745936073" target="_blank" title="Talk to our student care team on WhatsApp!" rel="noopener noreferrer">
                    <img src="/images/whatsapp-scope-india.webp" alt="Call SCOPE INDIA" />
                </a>
                <a href="/" title="Watch SCOPE INDIA through photos and videos!">
                    <img src="/images/gallery-scope-india.webp" alt="SCOPE INDIA Gallery" />
                </a>
                {showBackButton && (
                    <Link id="web_menu_back" to="/courses" title="Back to Courses">
                        <img src="/images/backbutton.webp" alt="Back to Courses" title="Back to courses" />
                    </Link>
                )}
                <svg id="mobile_menu_button" xmlns="http://www.w3.org/2000/svg" fill="#fff" className="bi bi-list" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"></path>
                </svg>
            </div>
        </>
    );
};

export default Icons;
