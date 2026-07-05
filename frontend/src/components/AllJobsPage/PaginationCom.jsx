import React from "react";
import ReactPaginate from "react-paginate";
import { useJobContext } from "../../context/JobContext";
import styled from "styled-components";

const PaginationCom = () => {
    const { handleJobFetch, jobs } = useJobContext();

    // Backend returns `pages` field (not pageCount)
    const pageCount = jobs?.pages ?? jobs?.pageCount ?? 0;

    const handlePageClick = (e) => {
        handleJobFetch(
            `https://job-portal-gvcs.vercel.app/api/v1/jobs/all?page=${e.selected + 1}&limit=10`
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!pageCount || pageCount <= 1) return null;

    return (
        <Wrapper>
            <ReactPaginate
                breakLabel="···"
                onPageChange={handlePageClick}
                pageRangeDisplayed={4}
                pageCount={pageCount}
                previousLabel="← Prev"
                nextLabel="Next →"
                renderOnZeroPageCount={null}
                className="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                activeClassName="active"
                previousClassName="nav-item"
                previousLinkClassName="page-link nav-link"
                nextClassName="nav-item"
                nextLinkClassName="page-link nav-link"
                disabledClassName="disabled"
                breakClassName="break-item"
                breakLinkClassName="page-link"
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin-top: 28px;
    display: flex;
    justify-content: center;

    .pagination {
        display: flex;
        align-items: center;
        gap: 5px;
        list-style: none;
        padding: 0;
        margin: 0;
        flex-wrap: wrap;
        justify-content: center;
    }

    .page-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 34px;
        height: 34px;
        padding: 0 10px;
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
        background: #fff;
        border: 1.5px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        user-select: none;

        &:hover {
            background: #f8faff;
            border-color: #4f6ef7;
            color: #4f6ef7;
        }
    }

    .active .page-link {
        background: linear-gradient(135deg, #4f6ef7, #3a57e8);
        border-color: #4f6ef7;
        color: #fff;
        box-shadow: 0 2px 8px rgba(79, 110, 247, 0.35);
    }

    .nav-link {
        font-size: 12.5px;
        letter-spacing: 0.2px;
    }

    .disabled .page-link {
        color: #cbd5e1;
        border-color: #f1f5f9;
        background: #f8faff;
        cursor: not-allowed;
        pointer-events: none;
    }

    .break-item .page-link {
        border: none;
        background: transparent;
        color: #94a3b8;
        cursor: default;
    }
`;

export default PaginationCom;
