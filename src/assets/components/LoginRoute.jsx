import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const LoginRoute = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/profile', {
          credentials: 'include'
        });
        if (res.ok) {
          navigate('/profile', { replace: true });
        }
      } catch {
        // ignore error
      }
    };
    checkAuth();
  }, [navigate]);

  return <Login {...props} />;
};

export default LoginRoute;
