/* eslint-disable react/prop-types */
import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../Logo";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { FiMenu, FiX, FiGrid, FiBriefcase, FiLogOut } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";

const Navbar = ({ navbarRef }) => {
    const { user, userLoading, handleFetchMe } = useUserContext();
    const isLoggedIn = !userLoading && user && user.email;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.post(
                    "https://job-portal-gvcs.vercel.app/api/v1/auth/logout",
                    {},
                    { withCredentials: true }
                );
                Swal.fire({
                    icon: "success",
                    title: "Logged Out!",
                    text: response?.data?.message || "You have been logged out.",
                    timer: 1500,
                    showConfirmButton: false,
                });
                handleFetchMe();
                setIsMobileMenuOpen(false);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error?.response?.data?.detail || "Logout failed. Try again.",
                });
            }
        }
    };

    return (
        <Wrapper ref={navbarRef}>
            <div className="container">
                <Logo />

                {/* Desktop Nav Links */}
                <nav className="nav-links">
                    {/* Centered navigation links removed as requested */}
                </nav>

                {/* Desktop Actions */}
                {!isLoggedIn && (
                    <div className="nav-actions">
                        <NavLink className="btn-login" to="/login">
                            Log In
                        </NavLink>
                        <NavLink className="btn-register" to="/register">
                            Get Started →
                        </NavLink>
                    </div>
                )}

                {isLoggedIn && (
                    <div className="nav-actions">
                        <NavLink className="user-badge" to={user?.role === "admin" ? "/dashboard/admin" : "/dashboard"}>
                            <span className="user-avatar">
                                {user?.username?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                            <span className="user-name">{user?.username}</span>
                        </NavLink>
                        <button className="btn-logout" onClick={handleLogout}>
                            <FiLogOut />
                            <span>Logout</span>
                        </button>
                    </div>
                )}

                {/* Mobile Menu Toggle */}
                <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
                    {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && <div className="mobile-overlay" onClick={toggleMobileMenu} />}
                <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
                    <div className="mobile-menu-header">
                        <Logo />
                        <button className="mobile-close" onClick={toggleMobileMenu} aria-label="Close menu">
                            <FiX size={22} />
                        </button>
                    </div>

                    <nav className="mobile-nav-links">
                        {isLoggedIn && (
                            <>
                                {/* User info */}
                                <div className="mobile-user-info">
                                    <span className="mobile-user-avatar">
                                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                    <div className="mobile-user-details">
                                        <span className="mobile-user-name">{user?.username}</span>
                                        <span className="mobile-user-role">{user?.role}</span>
                                    </div>
                                </div>

                                <div className="mobile-divider" />

                                {user?.role === "admin" && (
                                    <NavLink className="mobile-nav-item" to="/dashboard/admin" onClick={toggleMobileMenu}>
                                        <FiGrid className="mobile-item-icon" />
                                        Admin Dashboard
                                    </NavLink>
                                )}
                                {user?.role === "recruiter" && (
                                    <NavLink className="mobile-nav-item" to="/dashboard" onClick={toggleMobileMenu}>
                                        <FiGrid className="mobile-item-icon" />
                                        Recruiter Dashboard
                                    </NavLink>
                                )}
                                {user?.role === "user" && (
                                    <NavLink className="mobile-nav-item" to="/dashboard" onClick={toggleMobileMenu}>
                                        <FiGrid className="mobile-item-icon" />
                                        User Dashboard
                                    </NavLink>
                                )}

                                <div className="mobile-divider" />

                                <button className="mobile-logout-btn" onClick={handleLogout}>
                                    <FiLogOut className="mobile-item-icon" />
                                    Logout
                                </button>
                            </>
                        )}

                        {!isLoggedIn && (
                            <div className="mobile-nav-actions">
                                <NavLink className="btn-login-mobile" to="/login" onClick={toggleMobileMenu}>
                                    Log In
                                </NavLink>
                                <NavLink className="btn-register-mobile" to="/register" onClick={toggleMobileMenu}>
                                    Get Started →
                                </NavLink>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;

    .container {
        width: 100%;
        max-width: 1280px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        gap: 2rem;
    }

    /* Center nav links */
    .nav-links {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        justify-content: center;
    }

    .nav-item {
        font-size: 14.5px;
        font-weight: 500;
        color: var(--color-text-light);
        padding: 8px 16px;
        border-radius: var(--radius-full);
        transition: var(--transition);
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .nav-icon {
        font-size: 16px;
    }
    .nav-item:hover {
        color: var(--color-primary);
        background: rgba(79, 110, 247, 0.06);
    }
    .nav-item.active {
        color: var(--color-primary);
        background: rgba(79, 110, 247, 0.08);
        font-weight: 600;
    }

    /* Action buttons */
    .nav-actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    /* User badge */
    .user-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 12px 4px 4px;
        background: rgba(79, 110, 247, 0.06);
        border-radius: var(--radius-full);
        border: 1px solid rgba(79, 110, 247, 0.12);
        transition: var(--transition);
        text-decoration: none;
    }
    .user-badge:hover {
        background: rgba(79, 110, 247, 0.12);
        border-color: rgba(79, 110, 247, 0.25);
        transform: translateY(-1px);
    }
    .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 700;
    }
    .user-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-text);
        text-transform: capitalize;
    }

    .btn-logout {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        font-weight: 600;
        color: var(--color-danger);
        padding: 8px 16px;
        border-radius: var(--radius-full);
        border: 1.5px solid rgba(239, 68, 68, 0.3);
        background: transparent;
        transition: var(--transition);
        white-space: nowrap;
    }
    .btn-logout:hover {
        background: rgba(239, 68, 68, 0.06);
        border-color: var(--color-danger);
    }



    .btn-login {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text);
        padding: 8px 20px;
        border-radius: var(--radius-full);
        border: 1.5px solid var(--color-border);
        transition: var(--transition);
        white-space: nowrap;
    }
    .btn-login:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
        background: rgba(79, 110, 247, 0.04);
    }

    .btn-register {
        font-size: 14px;
        font-weight: 600;
        color: white;
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
        padding: 9px 22px;
        border-radius: var(--radius-full);
        transition: var(--transition);
        box-shadow: 0 2px 12px rgba(79, 110, 247, 0.3);
        white-space: nowrap;
    }
    .btn-register:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 20px rgba(79, 110, 247, 0.45);
    }
    .btn-register:active {
        transform: translateY(0);
    }

    .mobile-toggle {
        display: none;
        background: transparent;
        border: none;
        color: var(--color-text);
        cursor: pointer;
        z-index: 1000;
        padding: 4px;
    }

    /* Mobile overlay */
    .mobile-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 899;
        backdrop-filter: blur(2px);
    }

    .mobile-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 300px;
        max-width: 85vw;
        height: 100vh;
        height: 100dvh;
        background: var(--color-white);
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 900;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }
    .mobile-menu.open {
        right: 0;
    }

    .mobile-menu-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-border);
    }
    .mobile-close {
        background: transparent;
        border: none;
        color: var(--color-text-light);
        padding: 4px;
        border-radius: 6px;
        transition: var(--transition);
    }
    .mobile-close:hover {
        background: rgba(0,0,0,0.05);
        color: var(--color-text);
    }

    .mobile-nav-links {
        display: flex;
        flex-direction: column;
        padding: 16px 20px;
        gap: 4px;
        flex: 1;
    }

    /* Mobile user info */
    .mobile-user-info {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(79, 110, 247, 0.04);
        border-radius: 12px;
        margin-bottom: 4px;
    }
    .mobile-user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 700;
        flex-shrink: 0;
    }
    .mobile-user-details {
        display: flex;
        flex-direction: column;
    }
    .mobile-user-name {
        font-size: 15px;
        font-weight: 700;
        color: var(--color-text);
        text-transform: capitalize;
    }
    .mobile-user-role {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-primary);
        text-transform: capitalize;
    }

    .mobile-divider {
        height: 1px;
        background: var(--color-border);
        margin: 8px 0;
    }

    .mobile-nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 15px;
        font-weight: 600;
        color: var(--color-text);
        text-decoration: none;
        padding: 12px;
        border-radius: 10px;
        transition: var(--transition);
    }
    .mobile-nav-item:hover, .mobile-nav-item.active {
        color: var(--color-primary);
        background: rgba(79, 110, 247, 0.06);
    }
    .mobile-item-icon {
        font-size: 18px;
        flex-shrink: 0;
    }

    .mobile-logout-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 15px;
        font-weight: 600;
        color: var(--color-danger);
        padding: 12px;
        border-radius: 10px;
        border: none;
        background: transparent;
        transition: var(--transition);
        width: 100%;
        text-align: left;
    }
    .mobile-logout-btn:hover {
        background: rgba(239, 68, 68, 0.06);
    }

    .mobile-nav-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
    }

    .btn-login-mobile {
        font-size: 15px;
        font-weight: 600;
        color: var(--color-text);
        text-align: center;
        padding: 12px;
        border: 1.5px solid var(--color-border);
        border-radius: var(--radius-full);
        text-decoration: none;
        transition: var(--transition);
    }
    .btn-login-mobile:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    .btn-register-mobile {
        font-size: 15px;
        font-weight: 600;
        color: white;
        text-align: center;
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
        padding: 12px;
        border-radius: var(--radius-full);
        text-decoration: none;
        box-shadow: 0 2px 12px rgba(79, 110, 247, 0.3);
    }

    @media screen and (max-width: 768px) {
        .nav-links, .nav-actions { display: none; }
        .container { padding: 0.9rem 1.2rem; }
        .mobile-toggle { display: block; }
    }
`;

export default Navbar;
