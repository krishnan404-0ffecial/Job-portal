import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
    FiCheckCircle, FiCircle, FiUser, FiMapPin, FiFileText,
    FiBook, FiBriefcase, FiUpload, FiStar, FiGithub,
    FiAward, FiFolder, FiZap
} from "react-icons/fi";

/* ─── Scoring definition ──────────────────────────────────────────────────── */
const SECTIONS = [
    {
        key: "basic",
        label: "Basic Info",
        weight: 10,
        icon: <FiUser size={13} />,
        check: (u) => !!(u?.username && u?.email),
        tip: "Complete your name & email",
        link: null, // always done (can't be missing for logged-in user)
    },
    {
        key: "location",
        label: "Location",
        weight: 10,
        icon: <FiMapPin size={13} />,
        check: (u) => !!u?.location,
        tip: "Add your city / location",
        link: (u) => `/dashboard/edit-profile/${u?._id}`,
    },
    {
        key: "bio",
        label: "Bio / Summary",
        weight: 10,
        icon: <FiFileText size={13} />,
        check: (u) => !!(u?.bio && u.bio.trim().length > 10),
        tip: "Write a short bio about yourself",
        link: (u) => `/dashboard/edit-profile/${u?._id}`,
    },
    {
        key: "education",
        label: "Education",
        weight: 10,
        icon: <FiBook size={13} />,
        check: (u) => !!u?.education,
        tip: "Add your education details",
        link: (u) => `/dashboard/edit-profile/${u?._id}`,
    },
    {
        key: "experience",
        label: "Experience",
        weight: 10,
        icon: <FiBriefcase size={13} />,
        check: (u) => !!u?.experience,
        tip: "Add your work experience",
        link: (u) => `/dashboard/edit-profile/${u?._id}`,
    },
    {
        key: "resume",
        label: "Resume",
        weight: 15,
        icon: <FiUpload size={13} />,
        check: (u) => !!u?.resume,
        tip: "Upload your resume (PDF/DOCX)",
        link: () => "/dashboard",
    },
    {
        key: "skills",
        label: "Skills (3+)",
        weight: 15,
        icon: <FiStar size={13} />,
        check: (u) => (u?.skills?.length || 0) >= 3,
        tip: "Add at least 3 skills",
        link: () => "/dashboard/skills",
    },
    {
        key: "github",
        label: "GitHub",
        weight: 10,
        icon: <FiGithub size={13} />,
        check: (u) => !!u?.github_username,
        tip: "Connect your GitHub account",
        link: () => "/dashboard/github",
    },
    {
        key: "certifications",
        label: "Certifications",
        weight: 5,
        icon: <FiAward size={13} />,
        check: (u) => (u?.certifications?.length || 0) >= 1,
        tip: "Add at least 1 certification",
        link: () => "/dashboard/certifications",
    },
    {
        key: "projects",
        label: "Projects",
        weight: 5,
        icon: <FiFolder size={13} />,
        check: (u) => (u?.projects?.length || 0) >= 1,
        tip: "Add at least 1 project",
        link: () => "/dashboard/projects",
    },
];

/* ─── Helper: color by percent ───────────────────────────────────────────── */
const getColor = (pct) => {
    if (pct >= 90) return { stroke: "#10b981", bg: "#ecfdf5", text: "#065f46", label: "Excellent!" };
    if (pct >= 70) return { stroke: "#3b82f6", bg: "#eff6ff", text: "#1e40af", label: "Good" };
    if (pct >= 40) return { stroke: "#f59e0b", bg: "#fffbeb", text: "#92400e", label: "Fair" };
    return { stroke: "#ef4444", bg: "#fef2f2", text: "#991b1b", label: "Incomplete" };
};

/* ─── SVG Ring ────────────────────────────────────────────────────────────── */
const Ring = ({ pct, color }) => {
    const r = 44;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;

    return (
        <svg width="110" height="110" viewBox="0 0 110 110">
            {/* Track */}
            <circle cx="55" cy="55" r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
            {/* Progress */}
            <circle
                cx="55" cy="55" r={r}
                fill="none"
                stroke={color.stroke}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset="0"
                transform="rotate(-90 55 55)"
                style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }}
            />
            {/* Center text */}
            <text x="55" y="51" textAnchor="middle" fill={color.stroke} fontSize="20" fontWeight="800" fontFamily="Inter, sans-serif">
                {pct}%
            </text>
            <text x="55" y="66" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">
                COMPLETE
            </text>
        </svg>
    );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
const ProfileCompletionWidget = ({ user }) => {
    const { percentage, done, total, results } = useMemo(() => {
        let earned = 0;
        const results = SECTIONS.map((s) => {
            const passed = s.check(user);
            if (passed) earned += s.weight;
            return { ...s, passed };
        });
        const pct = Math.round(earned);
        return { percentage: pct, done: results.filter((r) => r.passed).length, total: results.length, results };
    }, [user]);

    const color = getColor(percentage);
    const missing = results.filter((r) => !r.passed);
    const completed = results.filter((r) => r.passed);

    return (
        <Wrapper style={{ "--ring-color": color.stroke }}>
            {/* Header */}
            <div className="pcw-header">
                <FiZap size={14} className="pcw-header-icon" />
                <span>Profile Strength</span>
            </div>

            {/* Ring + Summary */}
            <div className="pcw-ring-row">
                <div className="pcw-ring">
                    <Ring pct={percentage} color={color} />
                </div>
                <div className="pcw-summary">
                    <span className="pcw-label" style={{ color: color.text, background: color.bg }}>
                        {color.label}
                    </span>
                    <p className="pcw-fraction">{done}/{total} sections done</p>

                    {/* Linear bar */}
                    <div className="pcw-bar-track">
                        <div
                            className="pcw-bar-fill"
                            style={{ width: `${percentage}%`, background: color.stroke }}
                        />
                    </div>

                    {percentage < 100 ? (
                        <p className="pcw-motivate">
                            🚀 {100 - percentage}% left to reach 100%!
                        </p>
                    ) : (
                        <p className="pcw-motivate complete">
                            🎉 Profile fully completed!
                        </p>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="pcw-divider" />

            {/* Checklist */}
            <div className="pcw-checklist">
                {/* Missing items */}
                {missing.length > 0 && (
                    <>
                        <p className="pcw-section-title missing-title">⚡ Complete these to boost</p>
                        {missing.map((s) => {
                            const href = s.link ? s.link(user) : null;
                            return (
                                <div key={s.key} className="pcw-item pcw-item-missing">
                                    <FiCircle size={14} className="pcw-icon-miss" />
                                    <div className="pcw-item-body">
                                        <span className="pcw-item-label">{s.label}</span>
                                        <span className="pcw-item-tip">{s.tip}</span>
                                    </div>
                                    <span className="pcw-item-weight">+{s.weight}%</span>
                                    {href && (
                                        <Link to={href} className="pcw-item-link">
                                            Add →
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}

                {/* Completed items */}
                {completed.length > 0 && (
                    <>
                        <p className="pcw-section-title done-title">✅ Completed</p>
                        {completed.map((s) => (
                            <div key={s.key} className="pcw-item pcw-item-done">
                                <FiCheckCircle size={14} className="pcw-icon-done" />
                                <div className="pcw-item-body">
                                    <span className="pcw-item-label">{s.label}</span>
                                </div>
                                <span className="pcw-item-weight done-w">+{s.weight}%</span>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* CTA */}
            {percentage < 100 && (
                <Link
                    to={`/dashboard/edit-profile/${user?._id}`}
                    className="pcw-cta"
                >
                    Complete Profile Now
                </Link>
            )}
        </Wrapper>
    );
};

/* ─── Animations ─────────────────────────────────────────────────────────── */
const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; }`;
const shimmer = keyframes`0%,100%{opacity:1}50%{opacity:0.6}`;

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const Wrapper = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    border: 1px solid #f1f5f9;
    font-family: 'Inter', sans-serif;
    animation: ${fadeIn} 0.4s ease;

    /* ── Header ── */
    .pcw-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 1rem;
    }
    .pcw-header-icon { color: #f59e0b; }

    /* ── Ring row ── */
    .pcw-ring-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.75rem;
    }
    .pcw-ring { flex-shrink: 0; }

    /* ── Summary ── */
    .pcw-summary { flex: 1; min-width: 0; }
    .pcw-label {
        display: inline-block;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        border-radius: 999px;
        padding: 3px 10px;
        margin-bottom: 6px;
    }
    .pcw-fraction {
        font-size: 12px;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 8px;
    }
    .pcw-bar-track {
        height: 6px;
        background: #e2e8f0;
        border-radius: 999px;
        overflow: hidden;
        margin-bottom: 6px;
    }
    .pcw-bar-fill {
        height: 100%;
        border-radius: 999px;
        transition: width 1s cubic-bezier(0.4,0,0.2,1);
    }
    .pcw-motivate {
        font-size: 11px;
        color: #64748b;
        font-weight: 600;
    }
    .pcw-motivate.complete {
        color: #10b981;
        animation: ${shimmer} 2s ease infinite;
    }

    /* ── Divider ── */
    .pcw-divider {
        height: 1px;
        background: #f1f5f9;
        margin: 0.75rem 0;
    }

    /* ── Checklist ── */
    .pcw-checklist {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .pcw-section-title {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        margin: 6px 0 4px;
    }
    .missing-title { color: #f59e0b; }
    .done-title    { color: #10b981; }

    .pcw-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 8px;
        transition: background 0.15s;
        font-size: 12px;
    }
    .pcw-item-missing {
        background: #fffbeb;
        border: 1px solid #fde68a;
    }
    .pcw-item-missing:hover { background: #fef3c7; }
    .pcw-item-done {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        opacity: 0.8;
    }

    .pcw-icon-done { color: #10b981; flex-shrink: 0; }
    .pcw-icon-miss { color: #d1d5db; flex-shrink: 0; }

    .pcw-item-body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }
    .pcw-item-label {
        font-weight: 700;
        color: #1e293b;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .pcw-item-tip {
        font-size: 10px;
        color: #92400e;
        font-weight: 500;
        margin-top: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .pcw-item-weight {
        font-size: 10px;
        font-weight: 800;
        color: #f59e0b;
        background: #fef3c7;
        border-radius: 999px;
        padding: 1px 6px;
        flex-shrink: 0;
    }
    .pcw-item-weight.done-w {
        color: #10b981;
        background: #d1fae5;
    }
    .pcw-item-link {
        font-size: 10px;
        font-weight: 800;
        color: #4338ca;
        background: #eef2ff;
        border-radius: 6px;
        padding: 2px 8px;
        text-decoration: none;
        white-space: nowrap;
        flex-shrink: 0;
        transition: background 0.15s;
    }
    .pcw-item-link:hover { background: #e0e7ff; color: #3730a3; }

    /* ── CTA ── */
    .pcw-cta {
        display: block;
        margin-top: 1rem;
        text-align: center;
        background: linear-gradient(135deg, #4338ca, #6366f1);
        color: #fff;
        border-radius: 10px;
        padding: 9px;
        font-size: 12px;
        font-weight: 700;
        text-decoration: none;
        transition: 0.2s;
        box-shadow: 0 3px 12px rgba(67,56,202,0.25);
    }
    .pcw-cta:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(67,56,202,0.35);
    }
`;

export default ProfileCompletionWidget;
