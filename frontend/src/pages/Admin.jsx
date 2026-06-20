import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";
import LoadingComTwo from "../components/shared/LoadingComTwo";
import Swal from "sweetalert2";

const API = "http://localhost:8000/api/v1";

const fetcher = (url) => axios.get(url, { withCredentials: true }).then(r => r.data);

const STATUS_COLOR = {
    pending:   { bg: "#fef3c7", color: "#92400e" },
    interview: { bg: "#dbeafe", color: "#1e3a8a" },
    accepted:  { bg: "#d1fae5", color: "#065f46" },
    declined:  { bg: "#fee2e2", color: "#991b1b" },
};

const Admin = () => {
    const qc = useQueryClient();
    const [activeTab, setActiveTab] = useState("overview");
    const [appFilter, setAppFilter] = useState("all");

    // Recruiter applications states
    const [selectedRecApp, setSelectedRecApp] = useState(null);
    const [assignedFID, setAssignedFID] = useState("");
    const [assignedPass, setAssignedPass] = useState("");

    // Create Recruiter form
    const { register: regR, handleSubmit: hsR, reset: resetR, formState: { errors: errR } } = useForm();
    const [recLoading, setRecLoading] = useState(false);

    // Stats
    const { data: stats, isPending: statsLoading } = useQuery({
        queryKey: ["admin_stats"],
        queryFn: () => fetcher(`${API}/admin/stats`),
    });

    // Recruiter Applications
    const { data: recAppsData } = useQuery({
        queryKey: ["admin_recruiter_applications"],
        queryFn: () => fetcher(`${API}/admin/recruiter-applications`),
        enabled: activeTab === "recruiter-applications",
    });

    // All Users
    const { data: usersData } = useQuery({
        queryKey: ["admin_users"],
        queryFn: () => fetcher(`${API}/admin/users`),
        enabled: activeTab === "users",
    });

    // All Applications
    const { data: appsData } = useQuery({
        queryKey: ["admin_applications"],
        queryFn: () => fetcher(`${API}/applications/all`),
        enabled: activeTab === "applications",
    });

    // Change Role
    const roleMutation = useMutation({
        mutationFn: ({ user_id, role }) =>
            axios.put(`${API}/admin/role`, { user_id, role }, { withCredentials: true }),
        onSuccess: () => {
            Swal.fire({ icon: "success", title: "Done!", text: "User role updated.", timer: 1500, showConfirmButton: false });
            qc.invalidateQueries(["admin_users"]);
            qc.invalidateQueries(["admin_stats"]);
        },
        onError: (e) => Swal.fire("Error", e?.response?.data?.detail || "Failed.", "error"),
    });

    // Update Application Status
    const appStatusMutation = useMutation({
        mutationFn: ({ application_id, status }) =>
            axios.put(`${API}/applications/status`, { application_id, status }, { withCredentials: true }),
        onSuccess: (_, vars) => {
            const label = vars.status === "accepted" ? "✅ Admitted" : vars.status === "declined" ? "❌ Declined" : "✔ Updated";
            Swal.fire({ icon: "success", title: label, timer: 1600, showConfirmButton: false });
            qc.invalidateQueries(["admin_applications"]);
            qc.invalidateQueries(["admin_stats"]);
        },
        onError: (e) => Swal.fire("Error", e?.response?.data?.detail || "Failed.", "error"),
    });

    // Delete Application
    const deleteAppMutation = useMutation({
        mutationFn: (app_id) =>
            axios.delete(`${API}/applications/${app_id}`, { withCredentials: true }),
        onSuccess: () => {
            Swal.fire({ icon: "success", title: "Deleted!", text: "Application removed.", timer: 1500, showConfirmButton: false });
            qc.invalidateQueries(["admin_applications"]);
            qc.invalidateQueries(["admin_stats"]);
        },
        onError: (e) => Swal.fire("Error", e?.response?.data?.detail || "Failed to delete.", "error"),
    });

    // Delete User
    const deleteUserMutation = useMutation({
        mutationFn: (user_id) =>
            axios.delete(`${API}/admin/users/${user_id}`, { withCredentials: true }),
        onSuccess: () => {
            Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
            qc.invalidateQueries(["admin_users"]);
            qc.invalidateQueries(["admin_stats"]);
        },
        onError: (e) => Swal.fire("Error", e?.response?.data?.detail || "Failed.", "error"),
    });

    // Recruiter Action Mutation (Approve / Reject)
    const recruiterActionMutation = useMutation({
        mutationFn: ({ application_id, action, foundation_id, password }) =>
            axios.post(`${API}/admin/recruiter-applications/action`, {
                application_id, action, foundation_id, password
            }, { withCredentials: true }),
        onSuccess: (_, vars) => {
            const label = vars.action === "approve" ? "✅ Recruiter Approved!" : "❌ Recruiter Rejected";
            Swal.fire({ icon: "success", title: label, text: vars.action === "approve" ? `Account ${vars.foundation_id} created successfully.` : "Application rejected.", timer: 2000, showConfirmButton: false });
            qc.invalidateQueries(["admin_recruiter_applications"]);
            qc.invalidateQueries(["admin_stats"]);
            qc.invalidateQueries(["admin_users"]);
        },
        onError: (e) => Swal.fire("Error", e?.response?.data?.detail || "Failed to process recruiter request.", "error"),
    });

    const handleRejectRecruiter = (appId, name) => {
        Swal.fire({
            title: `Reject application from "${name}"?`,
            text: "This will mark their application as rejected.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, reject!",
        }).then(r => {
            if (r.isConfirmed) {
                recruiterActionMutation.mutate({ application_id: appId, action: "reject" });
            }
        });
    };

    const openApproveModal = (app) => {
        setSelectedRecApp(app);
        // Generate a random password of length 8 (letters + numbers)
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let pass = "";
        for (let i = 0; i < 8; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setAssignedPass(pass);

        // Fetch a sequential ID or search stats for recruiter count
        const recCount = stats?.result?.recruiters || 0;
        const nextIdNum = recCount + 1;
        const idPadding = nextIdNum < 10 ? `00${nextIdNum}` : nextIdNum < 100 ? `0${nextIdNum}` : nextIdNum;
        setAssignedFID(`VGLUG-REC-${idPadding}`);
    };

    const confirmDeleteApp = (app_id, username) => {
        Swal.fire({
            title: `Delete application by "${username}"?`,
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete!",
        }).then(r => { if (r.isConfirmed) deleteAppMutation.mutate(app_id); });
    };

    const confirmDeleteUser = (user_id, username) => {
        Swal.fire({
            title: `Delete user "${username}"?`,
            text: "This cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete!",
        }).then(r => { if (r.isConfirmed) deleteUserMutation.mutate(user_id); });
    };

    if (statsLoading) return <LoadingComTwo />;

    const s = stats?.result || {};

    const allApps = appsData?.result || [];
    const filteredApps = appFilter === "all" ? allApps : allApps.filter(a => a.status === appFilter);

    const statCards = [
        { label: "Total Members",      value: s.total_users,        color: "#4f6ef7", icon: "👥" },
        { label: "Admins",             value: s.admins,             color: "#8b5cf6", icon: "🛡️" },
        { label: "Recruiters",         value: s.recruiters,         color: "#14b8a6", icon: "🧑‍💼" },
        { label: "Job Seekers",        value: s.members,            color: "#10b981", icon: "👨‍💻" },
        { label: "Total Jobs",         value: s.total_jobs,         color: "#f97316", icon: "💼" },
        { label: "Open Jobs",          value: s.open_jobs,          color: "#22c55e", icon: "🟢" },
        { label: "Total Applications", value: s.total_applications, color: "#6366f1", icon: "📋" },
        { label: "Pending Review",     value: s.pending_apps,       color: "#f59e0b", icon: "⏳" },
        { label: "Interviews",         value: s.interview_apps,     color: "#3b82f6", icon: "🎙️" },
        { label: "Admitted",           value: s.accepted_apps,      color: "#10b981", icon: "✅" },
        { label: "Declined",           value: s.declined_apps,      color: "#ef4444", icon: "❌" },
    ];

    const tabs = ["overview", "applications", "users", "create-recruiter", "recruiter-applications"];

    // ── Create Recruiter submit ────────────────────────────
    const onCreateRecruiter = async (data) => {
        if (data.password !== data.confirmPassword) {
            Swal.fire({ icon: "error", title: "Error", text: "Passwords do not match." });
            return;
        }
        setRecLoading(true);
        try {
            const res = await axios.post(`${API}/admin/create-recruiter`, {
                username:        data.username,
                foundation_id:   data.foundation_id,
                email:           data.email,
                password:        data.password,
                company_name:    data.company_name,
                designation:     data.designation || "",
                company_website: data.company_website || "",
            }, { withCredentials: true });
            Swal.fire({ icon: "success", title: "✅ Recruiter Created!", text: res.data.message });
            resetR();
            qc.invalidateQueries(["admin_stats"]);
            qc.invalidateQueries(["admin_users"]);
        } catch (err) {
            Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.detail || "Something went wrong." });
        }
        setRecLoading(false);
    };

    return (
        <Wrapper>
            <div className="header">
                <h2>Admin Control Panel</h2>
                <p>Manage members, job applications, roles, and admissions</p>
            </div>

            {/* Tab Nav */}
            <div className="tabs">
                {tabs.map(t => (
                    <button
                        key={t}
                        className={`tab ${activeTab === t ? "active" : ""}`}
                        onClick={() => setActiveTab(t)}
                    >
                        {t === "overview" && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                                Overview
                            </span>
                        )}
                        {t === "applications" && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                Applications ({s.total_applications || 0})
                            </span>
                        )}
                        {t === "users" && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                All Members
                            </span>
                        )}
                        {t === "create-recruiter" && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                                Add Recruiter
                            </span>
                        )}
                        {t === "recruiter-applications" && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                Recruiter Requests ({s.recruiter_applications_count || 0})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
                <div className="stat-grid">
                    {statCards.map(c => (
                        <div className="stat-card" key={c.label} style={{ borderLeftColor: c.color }}>
                            <div className="stat-icon">{c.icon}</div>
                            <div className="stat-num" style={{ color: c.color }}>{c.value ?? "—"}</div>
                            <div className="stat-label">{c.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── APPLICATIONS ── */}
            {activeTab === "applications" && (
                <div className="section">
                    <div className="apps-header">
                        <h3>📋 All Job Applications</h3>
                        <div className="filter-row">
                            {["all", "pending", "interview", "accepted", "declined"].map(f => (
                                <button
                                    key={f}
                                    className={`filter-btn ${appFilter === f ? "active" : ""}`}
                                    onClick={() => setAppFilter(f)}
                                >
                                    {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!filteredApps.length ? (
                        <div className="empty">📭 No applications found for this filter.</div>
                    ) : (
                        <div className="app-table-wrap">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Applicant</th>
                                        <th>Foundation ID</th>
                                        <th>Job Position</th>
                                        <th>Company</th>
                                        <th>Resume</th>
                                        <th>Applied</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApps.map((app, idx) => {
                                        const sc = STATUS_COLOR[app.status] || { bg: "#f3f4f6", color: "#374151" };
                                        const appliedDate = app.applied_at
                                            ? new Date(app.applied_at).toLocaleDateString("en-IN", {
                                                  day: "2-digit", month: "short", year: "numeric",
                                              })
                                            : "—";
                                        return (
                                            <tr key={app._id}>
                                                <td>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</td>
                                                <td className="applicant-name">{app.username || "—"}</td>
                                                <td><span className="fid-tag">{app.foundation_id || "—"}</span></td>
                                                <td className="job-pos">{app.position || "—"}</td>
                                                <td>{app.company || "—"}</td>
                                                <td>
                                                    {app.resume_url ? (
                                                        <a
                                                            href={`http://localhost:8000${app.resume_url}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="resume-link"
                                                        >
                                                            📄 View PDF
                                                        </a>
                                                    ) : (
                                                        <span className="no-resume">—</span>
                                                    )}
                                                </td>
                                                <td className="date">{appliedDate}</td>
                                                <td>
                                                    <div className="status-col">
                                                        <span className="status-pill"
                                                            style={{ background: sc.bg, color: sc.color }}>
                                                            {app.status || "pending"}
                                                        </span>
                                                        {app.status === "declined" && app.rejected_by_name && (
                                                            <span className="rejected-by-tag">
                                                                by {app.rejected_by_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="acts">
                                                    {app.status !== "accepted" && (
                                                        <button
                                                            className="act-btn admit"
                                                            onClick={() => appStatusMutation.mutate({ application_id: app._id, status: "accepted" })}
                                                            disabled={appStatusMutation.isPending}
                                                        >✅ Admit</button>
                                                    )}
                                                    {app.status !== "interview" && app.status !== "accepted" && (
                                                        <button
                                                            className="act-btn interview"
                                                            onClick={() => appStatusMutation.mutate({ application_id: app._id, status: "interview" })}
                                                            disabled={appStatusMutation.isPending}
                                                        >🎙️ Interview</button>
                                                    )}
                                                    {app.status !== "declined" && (
                                                        <button
                                                            className="act-btn decline"
                                                            onClick={() => appStatusMutation.mutate({ application_id: app._id, status: "declined" })}
                                                            disabled={appStatusMutation.isPending}
                                                        >❌ Decline</button>
                                                    )}
                                                    <button
                                                        className="act-btn delete"
                                                        onClick={() => confirmDeleteApp(app._id, app.username)}
                                                        disabled={deleteAppMutation.isPending}
                                                    >🗑️ Delete</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── ALL USERS ── */}
            {activeTab === "users" && (
                <div className="section">
                    <h3>👥 All Members ({usersData?.result?.length || 0})</h3>
                    <div className="user-list">
                        {usersData?.result?.map(u => (
                            <div className="user-row" key={u._id}>
                                <div className="user-info">
                                    <span className="uname">{u.username}</span>
                                    <span className="ufid">🪪 {u.foundation_id}</span>
                                    <span className="uemail">{u.email}</span>
                                    <span className={`urole role-${u.role}`}>{u.role}</span>
                                    {!u.is_approved && <span className="upending">⏳ Pending</span>}
                                </div>
                                <div className="user-actions">
                                    <select
                                        className="role-select"
                                        defaultValue={u.role}
                                        onChange={(e) => roleMutation.mutate({ user_id: u._id, role: e.target.value })}
                                    >
                                        <option value="user">user</option>
                                        <option value="recruiter">recruiter</option>
                                        <option value="admin">admin</option>
                                    </select>
                                    <button
                                        className="del-btn"
                                        onClick={() => confirmDeleteUser(u._id, u.username)}
                                        disabled={deleteUserMutation.isPending}
                                    >🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* ── CREATE RECRUITER ── */}
            {activeTab === "create-recruiter" && (
                <div className="rec-section">
                    <div className="rec-header">
                        <div className="rec-header-icon">🧑‍💼</div>
                        <div>
                            <h3>Create Recruiter Account</h3>
                            <p>Fill in the details below. The recruiter can log in immediately using the existing login page with their Foundation ID and password.</p>
                        </div>
                    </div>

                    <form onSubmit={hsR(onCreateRecruiter)} autoComplete="off" noValidate className="rec-form">
                        <div className="rec-grid">
                            {/* Full Name */}
                            <div className="rec-field">
                                <label>Full Name <span className="req-star">*</span></label>
                                <input type="text" placeholder="e.g. Arjun Kumar"
                                    {...regR("username", { required: "Name is required", minLength: { value: 3, message: "Min 3 chars" } })} />
                                {errR.username && <span className="ferr">{errR.username.message}</span>}
                            </div>

                            {/* Foundation ID */}
                            <div className="rec-field">
                                <label>Foundation ID <span className="req-star">*</span></label>
                                <input type="text" placeholder="e.g. VGLUG-REC-001"
                                    {...regR("foundation_id", { required: "Foundation ID is required" })} />
                                {errR.foundation_id && <span className="ferr">{errR.foundation_id.message}</span>}
                            </div>

                            {/* Email */}
                            <div className="rec-field">
                                <label>Email <span className="req-star">*</span></label>
                                <input type="email" placeholder="recruiter@company.com"
                                    {...regR("email", { required: "Email is required" })} />
                                {errR.email && <span className="ferr">{errR.email.message}</span>}
                            </div>

                            {/* Company Name */}
                            <div className="rec-field">
                                <label>Company Name <span className="req-star">*</span></label>
                                <input type="text" placeholder="e.g. VGLUG Foundation, Zoho Corp"
                                    {...regR("company_name", { required: "Company name is required" })} />
                                {errR.company_name && <span className="ferr">{errR.company_name.message}</span>}
                            </div>

                            {/* Designation */}
                            <div className="rec-field">
                                <label>Designation</label>
                                <input type="text" placeholder="e.g. HR Manager, Technical Lead"
                                    {...regR("designation")} />
                            </div>

                            {/* Company Website */}
                            <div className="rec-field">
                                <label>Company Website <span className="opt-tag">Optional</span></label>
                                <input type="url" placeholder="https://company.com"
                                    {...regR("company_website")} />
                            </div>

                            {/* Password */}
                            <div className="rec-field">
                                <label>Password <span className="req-star">*</span></label>
                                <input type="password" placeholder="Min 6 characters"
                                    {...regR("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} />
                                {errR.password && <span className="ferr">{errR.password.message}</span>}
                            </div>

                            {/* Confirm Password */}
                            <div className="rec-field">
                                <label>Confirm Password <span className="req-star">*</span></label>
                                <input type="password" placeholder="Repeat password"
                                    {...regR("confirmPassword", { required: "Please confirm password" })} />
                                {errR.confirmPassword && <span className="ferr">{errR.confirmPassword.message}</span>}
                            </div>
                        </div>

                        <div className="rec-notice">
                            ℹ️ The recruiter will use the <strong>Login page</strong> to access their account using their Foundation ID and password.
                        </div>

                        <button type="submit" className="rec-btn" disabled={recLoading}>
                            {recLoading ? "Creating Account..." : "🧑‍💼 Create Recruiter Account"}
                        </button>
                    </form>
                </div>
            )}

            {/* ── RECRUITER APPLICATIONS ── */}
            {activeTab === "recruiter-applications" && (
                <div className="section">
                    <div className="apps-header">
                        <h3>💼 Recruiter Access Requests</h3>
                    </div>

                    {!recAppsData?.result?.length ? (
                        <div className="empty">📭 No recruiter applications found.</div>
                    ) : (
                        <div className="app-table-wrap">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>Applicant Name</th>
                                        <th>Work Email</th>
                                        <th>Company</th>
                                        <th>Designation</th>
                                        <th>Location</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recAppsData.result.map((app) => {
                                        const isPending = app.status === "pending";
                                        const statusBg = app.status === "approved" ? "#d1fae5" : app.status === "rejected" ? "#fee2e2" : "#fef3c7";
                                        const statusColor = app.status === "approved" ? "#065f46" : app.status === "rejected" ? "#991b1b" : "#92400e";
                                        return (
                                            <tr key={app._id}>
                                                <td className="applicant-name">
                                                    <div>{app.username}</div>
                                                    <span style={{ fontSize: "11px", color: "#6b7280" }}>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                                                </td>
                                                <td>{app.email}</td>
                                                <td>
                                                    <div>{app.company_name}</div>
                                                    {app.company_website && (
                                                        <a href={app.company_website} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#4f6ef7", textDecoration: "underline" }}>Website</a>
                                                    )}
                                                </td>
                                                <td>{app.designation || "—"}</td>
                                                <td>{app.location || "—"}</td>
                                                <td>{app.phone || "—"}</td>
                                                <td>
                                                    <span className="status-pill" style={{ background: statusBg, color: statusColor }}>
                                                        {app.status}
                                                    </span>
                                                    {app.status === "approved" && app.assigned_foundation_id && (
                                                        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                                                            ID: <strong>{app.assigned_foundation_id}</strong>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="acts">
                                                    {isPending ? (
                                                        <>
                                                            <button
                                                                className="act-btn admit"
                                                                onClick={() => openApproveModal(app)}
                                                            >
                                                                ✅ Approve
                                                            </button>
                                                            <button
                                                                className="act-btn decline"
                                                                onClick={() => handleRejectRecruiter(app._id, app.username)}
                                                            >
                                                                ❌ Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>Processed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── APPROVAL CREDENTIALS MODAL ── */}
            {selectedRecApp && (
                <ModalOverlay onClick={(e) => e.target === e.currentTarget && setSelectedRecApp(null)}>
                    <ModalCard>
                        <div className="modal-header">
                            <h3>🔑 Assign Recruiter Credentials</h3>
                            <button className="close-btn" onClick={() => setSelectedRecApp(null)}>✕</button>
                        </div>
                        <p className="modal-sub">
                            Approve application from <strong>{selectedRecApp.username}</strong> ({selectedRecApp.company_name}).
                            Provide their official login details below.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div className="field">
                                <label style={{ fontSize: "12.5px", fontWeight: "700", color: "#374151" }}>Assign Foundation ID</label>
                                <input
                                    type="text"
                                    className="modal-input"
                                    value={assignedFID}
                                    onChange={(e) => setAssignedFID(e.target.value)}
                                    style={{ padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", width: "100%" }}
                                />
                            </div>

                            <div className="field">
                                <label style={{ fontSize: "12.5px", fontWeight: "700", color: "#374151" }}>Assign Login Password</label>
                                <input
                                    type="text"
                                    className="modal-input"
                                    value={assignedPass}
                                    onChange={(e) => setAssignedPass(e.target.value)}
                                    style={{ padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", width: "100%" }}
                                />
                            </div>

                            <div className="modal-actions" style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                                <button
                                    className="rec-btn"
                                    onClick={() => {
                                        recruiterActionMutation.mutate({
                                            application_id: selectedRecApp._id,
                                            action: "approve",
                                            foundation_id: assignedFID,
                                            password: assignedPass
                                        });
                                        setSelectedRecApp(null);
                                    }}
                                    disabled={recruiterActionMutation.isPending}
                                    style={{ flex: 1 }}
                                >
                                    Admit & Send Credentials
                                </button>
                                <button
                                    className="tab"
                                    onClick={() => setSelectedRecApp(null)}
                                    style={{ margin: 0, padding: "12px 20px" }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </ModalCard>
                </ModalOverlay>
            )}

        </Wrapper>
    );
};

const ModalOverlay = styled.div`
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(3px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fadeIn 0.2s ease;
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

const ModalCard = styled.div`
    background: #fff; border-radius: 20px;
    padding: 36px 40px; width: 100%; max-width: 440px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18);
    animation: slideUp 0.25s ease;
    @keyframes slideUp { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .modal-header h3 { font-size: 19px; font-weight: 800; color: #111; }
    .close-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: #6b7280; padding: 4px 8px; border-radius: 6px; }
    .close-btn:hover { background: #f3f4f6; color: #111; }
    .modal-sub { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
`;

const Wrapper = styled.section`
    padding: 8px 0 40px;

    .header { margin-bottom: 24px; }
    .header h2 { font-size: 22px; font-weight: 800; color: #111; }
    .header p  { font-size: 13px; color: #6b7280; margin-top: 4px; }

    /* Tabs */
    .tabs { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
    .tab {
        padding: 9px 20px; border-radius: 999px; font-size: 13px; font-weight: 600;
        border: 1.5px solid #e5e7eb; background: white; cursor: pointer; color: #6b7280;
        transition: all 0.2s ease;
    }
    .tab:hover { border-color: #4f6ef7; color: #4f6ef7; background: #eef1ff; }
    .tab.active { background: linear-gradient(135deg, #4f6ef7, #7b93f9); color: white; border-color: transparent; box-shadow: 0 4px 14px rgba(79,110,247,0.35); }

    /* Overview grid */
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 500px) { .stat-grid { grid-template-columns: 1fr 1fr; } }

    .stat-card {
        background: white; border: 1px solid #f0f0f0; border-left: 4px solid;
        border-radius: 14px; padding: 20px; transition: 0.25s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
    .stat-icon { font-size: 26px; margin-bottom: 8px; }
    .stat-num  { font-size: 34px; font-weight: 900; line-height: 1; margin-bottom: 6px; }
    .stat-label { font-size: 12px; color: #6b7280; font-weight: 500; }

    /* Section */
    .section { background: white; border: 1px solid #f0f0f0; border-radius: 16px; padding: 24px; }
    .section h3 { font-size: 17px; font-weight: 800; color: #111; margin-bottom: 18px; }
    .empty { text-align: center; color: #6b7280; padding: 40px; font-size: 15px; }

    /* Applications filter */
    .apps-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
    .filter-row { display: flex; gap: 6px; flex-wrap: wrap; }
    .filter-btn {
        padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600;
        border: 1.5px solid #e5e7eb; background: white; cursor: pointer; color: #6b7280; transition: 0.15s;
    }
    .filter-btn:hover { border-color: #4f6ef7; color: #4f6ef7; }
    .filter-btn.active { background: #1e293b; color: white; border-color: #1e293b; }

    /* Applications table */
    .app-table-wrap { overflow-x: auto; }
    .app-table {
        width: 100%; border-collapse: collapse; font-size: 13px;
        border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;
    }
    .app-table thead { background: linear-gradient(135deg, #1e293b, #334155); color: white; }
    .app-table th, .app-table td { padding: 11px 14px; text-align: left; }
    .app-table tbody tr { border-bottom: 1px solid #f3f4f6; transition: background 0.12s; }
    .app-table tbody tr:hover { background: #f8faff; }
    .app-table tbody tr:last-child { border-bottom: none; }

    .applicant-name { font-weight: 700; color: #111; }
    .fid-tag { background: #fef3c7; color: #92400e; border-radius: 999px; padding: 2px 10px; font-size: 11px; font-weight: 700; }
    .job-pos { font-weight: 600; color: #374151; text-transform: capitalize; }
    .date { font-size: 12px; color: #9ca3af; }

    .resume-link {
        color: #4f6ef7; font-weight: 700; font-size: 12px;
        text-decoration: none; display: inline-flex; align-items: center; gap: 4px;
        padding: 3px 8px; background: #eef1ff; border-radius: 6px; transition: 0.15s;
    }
    .resume-link:hover { background: #4f6ef7; color: white; }
    .no-resume { color: #9ca3af; font-size: 12px; }

    .status-col { display: flex; flex-direction: column; gap: 4px; }
    .status-pill {
        display: inline-block; padding: 3px 12px; border-radius: 999px;
        font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
        width: fit-content;
    }
    .rejected-by-tag {
        font-size: 10px; color: #991b1b; background: #fee2e2;
        border-radius: 4px; padding: 1px 6px; font-weight: 600;
        width: fit-content;
    }

    .acts { display: flex; gap: 5px; flex-wrap: wrap; align-items: center; }
    .act-btn {
        padding: 4px 10px; border-radius: 7px; font-size: 11px; font-weight: 700;
        border: none; cursor: pointer; transition: 0.15s; white-space: nowrap;
    }
    .act-btn:hover { transform: translateY(-1px); }
    .act-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .act-btn.admit    { background: #d1fae5; color: #065f46; }
    .act-btn.admit:hover { background: #10b981; color: white; }
    .act-btn.interview { background: #dbeafe; color: #1e40af; }
    .act-btn.interview:hover { background: #3b82f6; color: white; }
    .act-btn.decline  { background: #fee2e2; color: #991b1b; }
    .act-btn.decline:hover { background: #ef4444; color: white; }
    .act-btn.delete   { background: #f3f4f6; color: #374151; }
    .act-btn.delete:hover { background: #ef4444; color: white; }

    /* Users */
    .user-list { display: flex; flex-direction: column; gap: 10px; }
    .user-row {
        display: flex; justify-content: space-between; align-items: center; gap: 16px;
        padding: 14px 18px; background: #f9fafb; border: 1px solid #e5e7eb;
        border-radius: 12px; flex-wrap: wrap; transition: 0.15s;
    }
    .user-row:hover { border-color: #c7d2fe; background: #f8faff; }
    .user-info { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .uname  { font-size: 14px; font-weight: 700; color: #111; }
    .ufid   { font-size: 12px; background: #fef3c7; color: #92400e; border-radius: 999px; padding: 2px 10px; font-weight: 600; }
    .uemail { font-size: 12px; color: #6b7280; }
    .urole  { font-size: 11px; font-weight: 700; border-radius: 999px; padding: 2px 10px; text-transform: uppercase; }
    .role-admin     { background: #fce7f3; color: #9d174d; }
    .role-recruiter { background: #d1fae5; color: #065f46; }
    .role-user      { background: #dbeafe; color: #1e40af; }
    .upending { font-size: 11px; color: #d97706; font-weight: 600; }
    .user-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
    .role-select {
        border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 6px 10px;
        font-size: 12px; font-weight: 600; cursor: pointer; outline: none;
        transition: 0.15s;
    }
    .role-select:focus { border-color: #4f6ef7; }
    .del-btn {
        padding: 6px 10px; background: #fee2e2; border: none; border-radius: 8px;
        font-size: 14px; cursor: pointer; transition: 0.15s;
    }
    .del-btn:hover { background: #ef4444; }

    /* ── Create Recruiter Section ──────────────────────── */
    .rec-section {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 32px;
        max-width: 860px;
    }
    .rec-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 28px;
        padding-bottom: 20px;
        border-bottom: 1px solid #f0f4ff;
    }
    .rec-header-icon {
        width: 56px; height: 56px;
        background: linear-gradient(135deg, #4f6ef7, #7b93f9);
        border-radius: 16px;
        display: flex; align-items: center; justify-content: center;
        font-size: 26px; flex-shrink: 0;
        box-shadow: 0 4px 14px rgba(79,110,247,0.35);
    }
    .rec-header h3 {
        font-size: 18px; font-weight: 800; color: #111; margin-bottom: 4px;
    }
    .rec-header p {
        font-size: 12.5px; color: #6b7280; line-height: 1.5;
    }

    .rec-form { width: 100%; }
    .rec-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        margin-bottom: 20px;
    }
    @media (max-width: 640px) { .rec-grid { grid-template-columns: 1fr; } }

    .rec-field {
        display: flex; flex-direction: column; gap: 5px;
    }
    .rec-field label {
        font-size: 12px; font-weight: 700; color: #374151;
        display: flex; align-items: center; gap: 6px;
    }
    .rec-field input {
        padding: 10px 14px;
        border: 1.5px solid #e5e7eb;
        border-radius: 10px;
        font-size: 13px; color: #111;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
        background: #fafafa;
    }
    .rec-field input:focus {
        border-color: #4f6ef7;
        box-shadow: 0 0 0 3px rgba(79,110,247,0.12);
        background: white;
    }
    .req-star { color: #ef4444; font-weight: 900; }
    .opt-tag {
        font-size: 10px; color: #6b7280; font-weight: 500;
        background: #f3f4f6; border-radius: 999px; padding: 1px 7px;
    }
    .ferr { font-size: 11px; color: #ef4444; font-weight: 600; }

    .rec-notice {
        background: linear-gradient(135deg, #eef1ff, #f0f9ff);
        border: 1px solid #c7d2fe;
        border-radius: 10px;
        padding: 12px 16px;
        font-size: 12.5px; color: #3730a3;
        margin-bottom: 20px;
        line-height: 1.5;
    }
    .rec-btn {
        width: 100%;
        padding: 14px;
        border: none; border-radius: 12px;
        background: linear-gradient(135deg, #4f6ef7, #7b93f9);
        color: white; font-size: 15px; font-weight: 700;
        cursor: pointer; transition: all 0.25s ease;
        box-shadow: 0 4px 16px rgba(79,110,247,0.35);
        letter-spacing: 0.3px;
    }
    .rec-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,110,247,0.45); }
    .rec-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

export default Admin;
