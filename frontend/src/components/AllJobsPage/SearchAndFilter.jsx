import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Job_Status, Job_Type, Job_Sort_By } from "../../utils/JobData";

import { CiSearch } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";
import { useJobContext } from "../../context/JobContext";

const SearchAndFilter = () => {
    const { handleJobFetch } = useJobContext();

    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const baseUrl = "https://job-portal-jk38.onrender.com/api/v1/jobs/all?page=1&limit=10";
        let url = baseUrl;
        const queryParams = {};

        if (searchQuery) queryParams.search = searchQuery;
        if (typeFilter) queryParams.job_type = typeFilter;
        if (statusFilter) queryParams.status = statusFilter;

        const queryString = new URLSearchParams(queryParams).toString();
        if (queryString) url += `&${queryString}`;

        handleJobFetch(url);
    }, [typeFilter, statusFilter, sortBy, searchQuery]);

    return (
        <Wrapper>
            {/* Search bar */}
            <div className="search-box">
                <CiSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by job title or company..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                />
            </div>

            {/* Filters */}
            <div className="filters">
                <span className="filter-label">
                    <MdFilterList /> Filters:
                </span>

                <div className="filter-group">
                    <label className="filter-item-label">Type</label>
                    <select
                        className="filter-select"
                        onChange={(e) => setTypeFilter(e.target.value)}
                        value={typeFilter}
                    >
                        <option value="">All</option>
                        {Job_Type?.map((type, i) => (
                            <option key={i} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-item-label">Status</label>
                    <select
                        className="filter-select"
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                    >
                        <option value="">All</option>
                        {Job_Status?.map((type, i) => (
                            <option key={i} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-item-label">Sort</label>
                    <select
                        className="filter-select"
                        onChange={(e) => setSortBy(e.target.value)}
                        value={sortBy}
                    >
                        <option value="">Default</option>
                        {Job_Sort_By?.map((type, i) => (
                            <option key={i} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {(typeFilter || statusFilter || sortBy || searchQuery) && (
                    <button
                        className="clear-btn"
                        onClick={() => {
                            setTypeFilter("");
                            setStatusFilter("");
                            setSortBy("");
                            setSearchQuery("");
                        }}
                    >
                        Clear
                    </button>
                )}
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    /* ── Search box ── */
    .search-box {
        position: relative;
        width: 100%;
    }
    .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 19px;
        color: #94a3b8;
        pointer-events: none;
    }
    .search-input {
        width: 100%;
        padding: 8px 16px 8px 42px;
        font-size: 13.5px;
        font-family: inherit;
        color: #0f172a;
        background: #ffffff;
        border: 1.5px solid #c7d2fe;
        border-radius: 10px;
        outline: none;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &::placeholder { color: #94a3b8; }
        &:focus {
            border-color: #4f6ef7;
            box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.13);
        }
    }

    /* ── Filters row ── */
    .filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
    }

    .filter-label {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 12.5px;
        font-weight: 600;
        color: #64748b;
        padding-right: 4px;

        svg { font-size: 16px; }
    }

    .filter-group {
        display: flex;
        align-items: center;
        border: 1.5px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        transition: border-color 0.2s ease;

        &:focus-within {
            border-color: #4f6ef7;
            box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.1);
        }
    }

    .filter-item-label {
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 6px 8px 6px 10px;
        background: #f8faff;
        border-right: 1px solid #e2e8f0;
        white-space: nowrap;
    }

    .filter-select {
        font-size: 12.5px;
        font-family: inherit;
        color: #0f172a;
        background: #fff;
        border: none;
        outline: none;
        padding: 6px 10px 6px 8px;
        text-transform: capitalize;
        cursor: pointer;
    }

    .clear-btn {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        background: #f1f5f9;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        padding: 5px 14px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            background: #0f172a;
            color: #fff;
            border-color: #0f172a;
        }
    }

    @media (max-width: 640px) {
        .filter-label { display: none; }
        .filters { gap: 6px; }
    }
`;

export default SearchAndFilter;
