import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-text-dark">404</h1>
        <p className="mb-8 text-xl text-text-medium">Oops! Page not found</p>
        <a 
          href="/" 
          className="btn-hero inline-flex items-center"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
