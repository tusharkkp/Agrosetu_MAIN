import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";

const Layout = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default Layout;