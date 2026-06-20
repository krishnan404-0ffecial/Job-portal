import React from "react";
import styled from "styled-components";

import { TfiLocationPin } from "react-icons/tfi";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { FaRegCalendarAlt, FaRupeeSign } from "react-icons/fa";
import { FiFileText, FiLock, FiEdit2 } from "react-icons/fi";

import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
dayjs.extend(advancedFormat);

import { useUserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
    const date = dayjs(job?.job_deadline).format("MMM Do, YYYY");
    const { user } = useUserContext();
    const navigate = useNavigate();
    const isLoggedIn = user && user.email;

    const statusColor = {
        open: "#16a34a",
        closed: "#64748b",
        pending: "#d97706",
    };
    const statusBg = {
        open: "#dcfce7",
        closed: "#f1f5f9",
        pending: "#fef3c7",
    };

    const initials = job?.company?.slice(0, 2).toUpperCase() || "?";
    const colorPalette = ["#4f6ef7", "#8b5cf6", "#f97316", "#10b981", "#ef4444", "#3b82f6"];
    const colorIndex = (job?.company?.charCodeAt(0) || 0) % colorPalette.length;
    const avatarColor = colorPalette[colorIndex];

    return (
        <Wrapper avatarColor={avatarColor}>
            <div className="card">
                {/* Left avatar */}
                <div className="avatar">{initials}</div>

                {/* Main content */}
                <div className="content">
                    <div className="top-row">
                        <div className="title-group">
                            <h2 className="position">{job?.position}</h2>
                            <span className="company">{job?.company}</span>
                        </div>
                        <span
                            className="status-badge"
                            style={{
                                color: statusColor[job?.status] || "#64748b",
                                background: statusBg[job?.status] || "#f1f5f9",
                            }}
                        >
                            {job?.status}
                        </span>
                    </div>

                    <div className="meta-row">
                        <span className="meta-item">
                            <TfiLocationPin />
                            {job?.job_location}
                        </span>
                        <span className="meta-item">
                            <BsFillBriefcaseFill />
                            {job?.job_type}
                        </span>
                        <span className="meta-item">
                            <FaRegCalendarAlt />
                            {date}
                        </span>
                        {job?.job_salary && (
                            <span className="meta-item salary">
                                <FaRupeeSign />
                                {job?.job_salary}
                            </span>
                        )}
                    </div>

                    {job?.job_skills?.length > 0 && (
                        <div className="skills-row">
                            {job.job_skills.slice(0, 4).map((skill, i) => (
                                <span key={i} className="skill-chip">{skill}</span>
                            ))}
                            {job.job_skills.length > 4 && (
                                <span className="skill-chip more">+{job.job_skills.length - 4}</span>
                            )}
                        </div>
                    )}

                    <div className="action-row">
                        <Link to={`/job/${job._id}`} className="btn btn-outline">
                            Details
                        </Link>

                        {isLoggedIn ? (
                            <Link
                                to={`/job/${job._id}`}
                                className="btn btn-primary"
                                title="Upload resume & apply from the detail page"
                            >
                                <FiFileText /> Apply
                            </Link>
                        ) : (
                            <button
                                className="btn btn-ghost"
                                onClick={() => navigate("/login", { state: { from: `/job/${job._id}` } })}
                                title="Login to apply"
                            >
                                <FiLock /> Login to Apply
                            </button>
                        )}

                        {isLoggedIn && user?._id === job?.created_by && (
                            <Link to={`/dashboard/edit-job/${job._id}`} className="btn btn-edit">
                                <FiEdit2 /> Edit
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;

    .card {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        background: #ffffff;
        border: 1px solid #d1d9f0;
        border-left: 4px solid transparent;
        border-radius: 10px;
        padding: 12px 14px;
        transition: box-shadow 0.22s ease, transform 0.22s ease, border-left-color 0.22s ease;
        height: 100%;
        box-sizing: border-box;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.07), 0 1px 2px rgba(0,0,0,0.05);
    }
    .card:hover {
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.16), 0 2px 8px rgba(0,0,0,0.08);
        border-left-color: #4f6ef7;
        transform: translateY(-3px);
    }

    /* Avatar */
    .avatar {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: ${({ avatarColor }) => avatarColor || "#4f6ef7"};
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0.5px;
    }

    /* Content */
    .content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .top-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
    }

    .title-group {
        min-width: 0;
    }

    .position {
        font-size: 13px;
        font-weight: 700;
        color: #0f172a;
        text-transform: capitalize;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.3;
    }
    .company {
        font-size: 11px;
        color: #64748b;
        font-weight: 500;
        text-transform: capitalize;
        display: block;
        margin-top: 1px;
    }

    .status-badge {
        flex-shrink: 0;
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 2px 7px;
        border-radius: 99px;
        white-space: nowrap;
    }

    /* Meta row */
    .meta-row {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 10px;
        align-items: center;
    }
    .meta-item {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 10.5px;
        color: #64748b;
        font-weight: 500;

        svg {
            font-size: 10px;
            flex-shrink: 0;
        }
    }
    .meta-item.salary {
        color: #16a34a;
        font-weight: 600;
    }

    /* Skills chips */
    .skills-row {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        align-items: center;
    }
    .skill-chip {
        font-size: 9.5px;
        font-weight: 600;
        color: #4f6ef7;
        background: rgba(79, 110, 247, 0.08);
        border: 1px solid rgba(79, 110, 247, 0.18);
        border-radius: 5px;
        padding: 1px 6px;
        text-transform: capitalize;
        white-space: nowrap;
    }
    .skill-chip.more {
        color: #94a3b8;
        background: #f1f5f9;
        border-color: #e2e8f0;
    }

    /* Action buttons */
    .action-row {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        align-items: center;
        margin-top: 1px;
    }
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 11px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
        white-space: nowrap;
        line-height: 1;

        svg { font-size: 10px; }
    }
    .btn-outline {
        background: transparent;
        color: #0f172a;
        border: 1.5px solid #cbd5e1;
    }
    .btn-outline:hover {
        background: #0f172a;
        color: #fff;
        border-color: #0f172a;
    }
    .btn-primary {
        background: linear-gradient(135deg, #4f6ef7, #3a57e8);
        color: #fff;
        box-shadow: 0 2px 8px rgba(79, 110, 247, 0.3);
    }
    .btn-primary:hover {
        box-shadow: 0 4px 16px rgba(79, 110, 247, 0.45);
        transform: translateY(-1px);
    }
    .btn-ghost {
        background: transparent;
        color: #4f6ef7;
        border: 1.5px solid #4f6ef7;
    }
    .btn-ghost:hover {
        background: #4f6ef7;
        color: #fff;
    }
    .btn-edit {
        background: #f8faff;
        color: #4f6ef7;
        border: 1.5px solid rgba(79, 110, 247, 0.25);
    }
    .btn-edit:hover {
        background: rgba(79, 110, 247, 0.08);
    }
`;

export default JobCard;
