import React from "react";
import styled from "styled-components";

import JobsListCom from "../components/AllJobsPage/JobsListCom";
import SearchAndFilter from "../components/AllJobsPage/SearchAndFilter";
import Navbar from "../components/shared/Navbar";
import PaginationCom from "../components/AllJobsPage/PaginationCom";

const AllJobs = () => {
    return (
        <>
            <Navbar />
            <PageWrapper>
                {/* Hero header strip */}
                <div className="page-hero">
                    <div className="hero-inner">
                        <div className="hero-badge">🔍 Opportunities</div>
                        <h1 className="page-title">Browse Jobs</h1>
                        <p className="page-subtitle">
                            Discover exclusive opportunities from top companies within the VGLUG network
                        </p>
                    </div>
                </div>

                {/* Content area */}
                <div className="content-wrapper">
                    <div className="content-area">
                        <SearchAndFilter />
                        <JobsListCom />
                        <PaginationCom />
                    </div>
                </div>
            </PageWrapper>
        </>
    );
};

const PageWrapper = styled.section`
    min-height: calc(100vh - 65px);
    background: #f0f4ff;

    /* ── Page hero strip — clean navy, no red ── */
    .page-hero {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #1e1b4b 100%);
        padding: 24px 1.5rem 32px;
        position: relative;
        overflow: hidden;

        /* Soft white/blue decorative glow — no red */
        &::after {
            content: "";
            position: absolute;
            top: -60px;
            right: -60px;
            width: 260px;
            height: 260px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }
    }

    .hero-inner {
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
    }

    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11.5px;
        font-weight: 700;
        color: #a5b4fc;
        background: rgba(165, 180, 252, 0.1);
        border: 1px solid rgba(165, 180, 252, 0.2);
        border-radius: 99px;
        padding: 4px 12px;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    .page-title {
        font-size: clamp(18px, 2.5vw, 24px);
        font-weight: 800;
        color: #f8fafc;
        letter-spacing: -0.5px;
        line-height: 1.2;
        margin-bottom: 8px;
    }

    .page-subtitle {
        font-size: 12.5px;
        color: rgba(255, 255, 255, 0.45);
        font-weight: 400;
        max-width: 480px;
    }

    /* ── Content wrapper ── */
    .content-wrapper {
        background: #f0f4ff;
        padding: 1.2rem 1.5rem 2.5rem;
        margin-top: 0;
        position: relative;
        z-index: 2;
    }

    .content-area {
        max-width: 1200px;
        margin: 0 auto;
        background: transparent;
    }
`;

export default AllJobs;
