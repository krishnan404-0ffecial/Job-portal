import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import styled from "styled-components";

const API = "https://job-portal-jk38.onrender.com/api/v1";

const RecruiterApply = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                username: data.username,
                email: data.email,
                company_name: data.company_name,
                company_website: data.company_website || "",
                designation: data.designation || "",
                phone: data.phone || "",
                location: data.location || "",
                message: data.message || "",
            };

            const res = await axios.post(`${API}/auth/recruiter-apply`, payload, { withCredentials: true });

            if (res.data?.status !== false) {
                Swal.fire({
                    icon: "success",
                    title: "Application Submitted",
                    text: res.data.message || "Your request has been sent to the administrator for review.",
                    confirmButtonColor: "#4f6ef7"
                });
                reset();
                navigate("/login");
            } else {
                Swal.fire({ icon: "error", title: "Oops!", text: res.data.message || "Submission failed." });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Application Failed",
                text: err?.response?.data?.detail || err?.response?.data?.message || "Something went wrong.",
            });
        }
        setIsLoading(false);
    };

    return (
        <Wrapper>
            <div className="main-content">
                {/* Left Panel: Naukri Style Benefits Info */}
                <div className="info-panel">
                    <div className="badge-corporate">RECRUITER PORTAL</div>
                    <h1>Hire the Best Tech Talent Directly</h1>
                    <p className="description">
                        Join hundreds of leading companies hiring verified developers, designers, and tech professionals from our platform.
                    </p>
                    
                    <div className="benefits-list">
                        <div className="benefit-item">
                            <div className="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </div>
                            <div>
                                <h4>Verified Candidate Database</h4>
                                <p>Every candidate profile is thoroughly vetted by administrators for skill authenticity.</p>
                            </div>
                        </div>

                        <div className="benefit-item">
                            <div className="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                            </div>
                            <div>
                                <h4>Skill-Based Smart Match</h4>
                                <p>Filter through candidates instantly based on exact programming languages and project scores.</p>
                            </div>
                        </div>

                        <div className="benefit-item">
                            <div className="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
                            </div>
                            <div>
                                <h4>AI Screening Assessment</h4>
                                <p>Generate custom screening sheets automatically to run automated technical interviews.</p>
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>10K+</h3>
                            <p>Active Profiles</p>
                        </div>
                        <div className="stat-card">
                            <h3>98%</h3>
                            <p>Success Rate</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Recruiter Form Card */}
                <div className="form-panel">
                    <div className="form-card">
                        <h2>Request Access</h2>
                        <p className="card-sub">Please fill in your company details. The admin will verify and provide your login details via email.</p>

                        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
                            <div className="form-grid">
                                <div className="field">
                                    <label>Full Name *</label>
                                    <input type="text" placeholder="Your name" 
                                        {...register("username", { required: "Name is required", minLength: { value: 3, message: "Min 3 characters" } })} />
                                    {errors.username && <span className="err">{errors.username.message}</span>}
                                </div>

                                <div className="field">
                                    <label>Work Email *</label>
                                    <input type="email" placeholder="name@company.com" 
                                        {...register("email", { 
                                            required: "Email is required", 
                                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                                        })} />
                                    {errors.email && <span className="err">{errors.email.message}</span>}
                                </div>

                                <div className="field">
                                    <label>Company Name *</label>
                                    <input type="text" placeholder="e.g. Google, Microsoft" 
                                        {...register("company_name", { required: "Company name is required" })} />
                                    {errors.company_name && <span className="err">{errors.company_name.message}</span>}
                                </div>

                                <div className="field">
                                    <label>Designation *</label>
                                    <input type="text" placeholder="e.g. HR Manager / Talent Lead" 
                                        {...register("designation", { required: "Designation is required" })} />
                                    {errors.designation && <span className="err">{errors.designation.message}</span>}
                                </div>

                                <div className="field">
                                    <label>Company Website</label>
                                    <input type="url" placeholder="https://company.com" 
                                        {...register("company_website")} />
                                </div>

                                <div className="field">
                                    <label>Work Phone</label>
                                    <input type="tel" placeholder="e.g. +91 99999 88888" 
                                        {...register("phone")} />
                                </div>

                                <div className="field full-width">
                                    <label>Company Location *</label>
                                    <input type="text" placeholder="e.g. Chennai, India / Remote" 
                                        {...register("location", { required: "Location is required" })} />
                                    {errors.location && <span className="err">{errors.location.message}</span>}
                                </div>

                                <div className="field full-width">
                                    <label>Introduction / Additional Notes</label>
                                    <textarea rows="3" placeholder="Brief details about your open roles..." 
                                        {...register("message")} />
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="submit-btn">
                                {isLoading ? "Submitting Request..." : "Request Recruiter Credentials"}
                            </button>
                        </form>

                        <div className="card-footer">
                            Already have recruiter credentials? <Link to="/login">Sign In here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    min-height: 100vh;
    background-color: #f3f4f6;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    font-family: 'Outfit', sans-serif;

    .main-content {
        width: 100%;
        max-width: 1120px;
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: 60px;
        background: #ffffff;
        border-radius: 24px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        border: 1px solid #e5e7eb;
    }
    @media (max-width: 900px) {
        .main-content {
            grid-template-columns: 1fr;
            gap: 40px;
        }
    }

    /* Left panel styling */
    .info-panel {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #ffffff;
        padding: 56px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    @media (max-width: 600px) {
        .info-panel { padding: 32px; }
    }

    .badge-corporate {
        background: rgba(79, 110, 247, 0.2);
        color: #7b93f9;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 999px;
        width: fit-content;
        letter-spacing: 1px;
        margin-bottom: 24px;
        border: 1px solid rgba(79, 110, 247, 0.3);
    }

    .info-panel h1 {
        font-size: 32px;
        font-weight: 800;
        line-height: 1.2;
        margin-bottom: 16px;
        letter-spacing: -0.5px;
    }

    .info-panel .description {
        font-size: 15.5px;
        color: #9ca3af;
        line-height: 1.6;
        margin-bottom: 40px;
    }

    .benefits-list {
        display: flex;
        flex-direction: column;
        gap: 28px;
        margin-bottom: 40px;
    }

    .benefit-item {
        display: flex;
        gap: 16px;
        align-items: flex-start;
    }

    .benefit-item .icon {
        width: 38px;
        height: 38px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        color: #7b93f9;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .benefit-item h4 {
        font-size: 15px;
        font-weight: 700;
        color: #f9fafb;
        margin-bottom: 6px;
    }

    .benefit-item p {
        font-size: 13.5px;
        color: #9ca3af;
        line-height: 1.5;
    }

    .stats-grid {
        display: flex;
        gap: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 32px;
    }

    .stat-card {
        flex: 1;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        padding: 16px;
        text-align: center;
    }

    .stat-card h3 {
        font-size: 24px;
        font-weight: 800;
        color: #ffffff;
        margin-bottom: 4px;
    }

    .stat-card p {
        font-size: 12px;
        color: #9ca3af;
    }

    /* Right panel styling */
    .form-panel {
        padding: 56px;
        background: #ffffff;
        display: flex;
        align-items: center;
    }
    @media (max-width: 600px) {
        .form-panel { padding: 32px; }
    }

    .form-card { width: 100%; }

    .form-card h2 {
        font-size: 24px;
        font-weight: 800;
        color: #1f2937;
        margin-bottom: 8px;
    }

    .card-sub {
        font-size: 13.5px;
        color: #6b7280;
        line-height: 1.5;
        margin-bottom: 32px;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        margin-bottom: 24px;
    }
    @media (max-width: 600px) {
        .form-grid { grid-template-columns: 1fr; }
    }

    .field { display: flex; flex-direction: column; gap: 6px; }
    .field.full-width { grid-column: 1 / -1; }
    .field label { font-size: 12.5px; font-weight: 700; color: #374151; }

    .field input, .field textarea {
        background: #fafafa;
        border: 1.5px solid #e5e7eb;
        border-radius: 10px;
        padding: 11px 14px;
        color: #1f2937;
        font-size: 13.5px;
        transition: all 0.25s ease;
        outline: none;
        font-family: inherit;
    }
    .field input::placeholder, .field textarea::placeholder { color: #9ca3af; }
    .field input:focus, .field textarea:focus {
        border-color: #4f6ef7;
        background: #ffffff;
        box-shadow: 0 0 0 4px rgba(79, 110, 247, 0.1);
    }
    .field textarea { resize: none; }
    .err { font-size: 11.5px; color: #ef4444; font-weight: 600; margin-top: 1px; }

    .submit-btn {
        width: 100%;
        padding: 14px;
        border: none;
        border-radius: 10px;
        background: #4f6ef7;
        color: #ffffff;
        font-size: 14.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(79, 110, 247, 0.2);
    }
    .submit-btn:hover:not(:disabled) {
        background: #3c5bd9;
        box-shadow: 0 6px 16px rgba(79, 110, 247, 0.35);
    }
    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .card-footer {
        text-align: center;
        font-size: 13px;
        color: #6b7280;
        margin-top: 24px;
    }
    .card-footer a {
        color: #4f6ef7;
        font-weight: 700;
        text-decoration: none;
    }
    .card-footer a:hover {
        text-decoration: underline;
    }
`;

export default RecruiterApply;
