import { Routes,Route } from "react-router-dom";
import Header from "./assets/components/Header";
import Home from "./assets/components/Home";
import Courses from "./assets/components/Courses";
import Footer from "./assets/components/Footer";
import Registration from "./assets/components/Registration";
import About from "./assets/components/About";
import Contact from "./assets/components/Contact";
import Icons from "./assets/components/Icons";
import SubcoursePage from "./assets/components/courses/Subpage";
import ScrollToTop from "./assets/components/ScrollToTop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./assets/components/Login";
import LoginRoute from "./assets/components/LoginRoute";
import Profile from "./assets/components/Profile";

function App() {
  return (
    <>
    <ScrollToTop />
    <Header/>
    <Icons/>
    <ToastContainer position="top-center" autoClose={3000} />
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/courses" element={<Courses/>}></Route>
      <Route path="/registration" element={<Registration/>}></Route>
      <Route path="/about" element={<About/>}></Route>
      <Route path="/contact" element={<Contact/>}></Route>
      <Route path="/courses/:subcourse" element={<SubcoursePage/>} />
      {/* <Route path='/login' element={<Login/>}></Route> */}
      <Route path='/login' element={<LoginRoute/>}></Route>
      <Route path="/profile" element={<Profile />} />
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
