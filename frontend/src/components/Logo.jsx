import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import vglugLogo from "../assets/media/M-LOGO.jpg";

const Logo = () => {
    return (
        <Wrapper>
            <Link to="/" className="logo-link">
                <div className="logo-ring">
                    <img src={vglugLogo} alt="VGLUG Foundation" className="logo-img" />
                </div>
                <span className="logo-text">
                    <span className="logo-vglug">VGLUG</span>
                    <span className="logo-portal"> Job Portal</span>
                </span>
            </Link>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    .logo-link {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        user-select: none;
    }

    /* Light white/grey ring around the logo */
    .logo-ring {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        padding: 2.5px;
        background: linear-gradient(135deg, #ffffff, #e8edf5);
        border: 1.5px solid #d1d9ef;
        box-shadow: 0 1px 6px rgba(99, 102, 241, 0.12), 0 2px 4px rgba(0, 0, 0, 0.07);
        flex-shrink: 0;
        transition: box-shadow 0.25s ease, transform 0.2s ease;
    }

    .logo-link:hover .logo-ring {
        box-shadow: 0 2px 12px rgba(99, 102, 241, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);
        transform: scale(1.05);
    }

    .logo-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        display: block;
    }

    .logo-text {
        display: flex;
        align-items: baseline;
        gap: 2px;
        font-size: 18px;
        font-weight: 800;
        letter-spacing: -0.3px;
        line-height: 1;
    }

    .logo-vglug {
        background: linear-gradient(135deg, var(--color-primary, #4f6ef7), var(--color-accent, #8b5cf6));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .logo-portal {
        color: var(--color-black, #0f172a);
        font-weight: 700;
    }

    @media screen and (max-width: 600px) {
        .logo-text { font-size: 15px; }
        .logo-ring { width: 34px; height: 34px; padding: 2px; }
    }
`;

export default Logo;
