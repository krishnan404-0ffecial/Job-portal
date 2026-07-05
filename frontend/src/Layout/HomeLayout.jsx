import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../pages/Footer";

const HomeLayout = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith("/dashboard");

    return (
        <div>
            <Outlet />
            {!isDashboard && <Footer />}
        </div>
    );
};

export default HomeLayout;
