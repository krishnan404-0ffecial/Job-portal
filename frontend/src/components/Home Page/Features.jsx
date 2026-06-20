import React from "react";
import styled from "styled-components";

const features = [
  {
    title: "Smart Skill Matching",
    description: "Our advanced algorithm analyzes candidate profiles, skill sets, and project repositories to map them directly to matching job listings.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  },
  {
    title: "Verified Student Profiles",
    description: "All candidate profiles undergo thorough admin verification and portfolio checks before being admitted to the job market database.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
  {
    title: "AI Screening & Assessment",
    description: "Recruiters can generate skill-specific technical screening question sheets to evaluate candidate competency dynamically.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    )
  },
  {
    title: "Direct Placement Drives",
    description: "Approved hiring partners get direct access to filter, export, and contact candidate pools without intermediate agencies.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
];

export default function Features() {
  return (
    <Wrapper>
      <div className="container">
        <div className="section-header">
          <h2>Why Choose Our Portal?</h2>
          <p>
            An internal ecosystem designed to connect talented developers with leading organizations, ensuring verified profiles, smart skill matching, and rapid recruitment.
          </p>
        </div>
        
        <div className="grid">
          {features.map((feat) => (
            <div className="card" key={feat.title}>
              <div className="icon-box">
                {feat.icon}
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: #f9fafb;
  padding: 80px 24px;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 60px;
  }

  .section-header h2 {
    font-size: 32px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }

  .section-header p {
    font-size: 16px;
    color: #4b5563;
    line-height: 1.6;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  .card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 32px;
    transition: all 0.25s ease;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.08);
    border-color: #4f6ef7;
  }

  .icon-box {
    width: 48px;
    height: 48px;
    background-color: #eef1ff;
    color: #4f6ef7;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .card h3 {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 12px;
  }

  .card p {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
  }
`;
