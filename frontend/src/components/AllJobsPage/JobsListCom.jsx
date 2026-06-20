import React from "react";
import { useJobContext } from "../../context/JobContext";
import LoadingComTwo from "../shared/LoadingComTwo";
import styled from "styled-components";
import JobCard from "./JobCard";
import { BsBriefcase } from "react-icons/bs";

const JobsListCom = () => {
    const { jobLoading, jobs } = useJobContext();

    if (jobLoading) {
        return <LoadingComTwo />;
    }

    if (!jobs?.result?.length) {
        return (
            <EmptyWrapper>
                <div className="empty-state">
                    <BsBriefcase className="empty-icon" />
                    <h3>No Jobs Found</h3>
                    <p>Try adjusting your filters or search query.</p>
                </div>
            </EmptyWrapper>
        );
    }

    const shown = jobs?.result?.length;
    const total = jobs?.total ?? jobs?.totalJobs ?? shown;

    return (
        <Wrapper>
            <div className="list-header">
                <span className="count-text">
                    Showing <strong>{shown < 10 ? `0${shown}` : shown}</strong> of{" "}
                    <strong>{total < 10 ? `0${total}` : total}</strong> jobs
                </span>
                <span className="divider" />
            </div>

            <div className="list-container">
                {jobs?.result?.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>
        </Wrapper>
    );
};

const EmptyWrapper = styled.div`
    width: 100%;
    padding: 60px 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .empty-state {
        text-align: center;
        color: #94a3b8;

        .empty-icon {
            font-size: 48px;
            margin-bottom: 14px;
            color: #cbd5e1;
        }
        h3 {
            font-size: 18px;
            font-weight: 700;
            color: #64748b;
            margin-bottom: 6px;
        }
        p {
            font-size: 13.5px;
            color: #94a3b8;
        }
    }
`;

const Wrapper = styled.div`
    margin-top: 0.8rem;

    .list-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }

    .count-text {
        font-size: 11.5px;
        color: #64748b;
        font-weight: 500;
        white-space: nowrap;

        strong {
            color: #4f6ef7;
            font-weight: 700;
        }
    }

    .divider {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, #e2e8f0, transparent);
    }

    /* Compact grid — min 260px per column */
    .list-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 10px;
        width: 100%;
        align-items: stretch;
    }

    @media (max-width: 600px) {
        .list-container {
            grid-template-columns: 1fr;
            gap: 8px;
        }
    }
`;

export default JobsListCom;
