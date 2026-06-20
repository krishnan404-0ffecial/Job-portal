from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from database import get_db
from auth_utils import require_admin
from typing import Optional
from bson import ObjectId
from passlib.context import CryptContext
from datetime import datetime

router = APIRouter()
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ApprovalModel(BaseModel):
    user_id: str
    action: str  # "approve" | "reject"

class RoleModel(BaseModel):
    user_id: str
    role: str  # "admin" | "recruiter" | "user"

class FoundationIDModel(BaseModel):
    foundation_id: str
    member_name: Optional[str] = ""

class CreateRecruiterModel(BaseModel):
    username: str
    foundation_id: str
    email: str
    password: str
    company_name: str
    designation: Optional[str] = ""
    company_website: Optional[str] = ""

class RecruiterAppActionModel(BaseModel):
    application_id: str
    action: str  # "approve" | "reject"
    foundation_id: Optional[str] = ""
    password: Optional[str] = ""

# ── Admin: Create Recruiter Account ──────────────────────
@router.post("/create-recruiter")
def create_recruiter(data: CreateRecruiterModel, request: Request):
    """Admin-only: create a recruiter account directly (no public registration)."""
    require_admin(request)
    db = get_db()

    foundation_id = data.foundation_id.strip().upper()

    if db.vgulg_users.find_one({"foundation_id": foundation_id}):
        raise HTTPException(status_code=400, detail="This Foundation ID is already registered.")

    if db.vgulg_users.find_one({"email": data.email.strip().lower()}):
        raise HTTPException(status_code=400, detail="Email already in use.")

    if len(data.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password too long (max 72 bytes).")

    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    new_recruiter = {
        "_id": str(ObjectId()),
        "username": data.username.strip(),
        "foundation_id": foundation_id,
        "email": data.email.strip().lower(),
        "password": pwd_ctx.hash(data.password),
        "role": "recruiter",
        "is_approved": True,
        "skills": [],
        "education": "",
        "experience": "",
        "location": "",
        "resume": "",
        "bio": "",
        "company_name": data.company_name.strip(),
        "company_website": (data.company_website or "").strip(),
        "designation": (data.designation or "").strip(),
        "created_at": datetime.utcnow().isoformat(),
    }
    db.vgulg_users.insert_one(new_recruiter)
    print(f"✅ Recruiter created by admin: {foundation_id} | {data.company_name}")
    return {"status": True, "message": f"Recruiter account for '{data.username}' created successfully!"}



# ── Dashboard Stats ──────────────────────────────────────
@router.get("/stats")
def get_stats(request: Request):
    require_admin(request)
    db = get_db()
    stats = {
        "total_users": db.vgulg_users.count_documents({}),
        "admins": db.vgulg_users.count_documents({"role": "admin"}),
        "recruiters": db.vgulg_users.count_documents({"role": "recruiter"}),
        "members": db.vgulg_users.count_documents({"role": "user"}),
        "pending_approval": db.vgulg_users.count_documents({"is_approved": False}),
        "total_jobs": db.vgulg_jobs.count_documents({}),
        "open_jobs": db.vgulg_jobs.count_documents({"status": "open"}),
        "total_applications": db.vgulg_applications.count_documents({}),
        "pending_apps": db.vgulg_applications.count_documents({"status": "pending"}),
        "interview_apps": db.vgulg_applications.count_documents({"status": "interview"}),
        "declined_apps": db.vgulg_applications.count_documents({"status": "declined"}),
        "accepted_apps": db.vgulg_applications.count_documents({"status": "accepted"}),
        "foundation_ids_count": db.foundation_ids.count_documents({}),
        "recruiter_applications_count": db.recruiter_applications.count_documents({"status": "pending"}),
    }
    return {"status": True, "result": stats}

# ── All Users ────────────────────────────────────────────
@router.get("/users")
def all_users(request: Request):
    require_admin(request)
    db = get_db()
    users = list(db.vgulg_users.find({}, {"password": 0}).sort("created_at", -1))
    return {"status": True, "result": users}

# ── Delete a User ────────────────────────────────────────
@router.delete("/users/{user_id}")
def delete_user(user_id: str, request: Request):
    require_admin(request)
    db = get_db()
    result = db.vgulg_users.delete_one({"_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"status": True, "message": "User deleted successfully."}

# ── Pending Approval Users ───────────────────────────────
@router.get("/pending")
def pending_users(request: Request):
    require_admin(request)
    db = get_db()
    users = list(db.vgulg_users.find({"is_approved": False}, {"password": 0}))
    return {"status": True, "result": users}

# ── Approve / Reject User ────────────────────────────────
@router.post("/approve")
def approve_user(data: ApprovalModel, request: Request):
    require_admin(request)
    db = get_db()
    if data.action == "approve":
        db.vgulg_users.update_one({"_id": data.user_id}, {"$set": {"is_approved": True}})
        return {"status": True, "message": "User approved successfully."}
    elif data.action == "reject":
        db.vgulg_users.delete_one({"_id": data.user_id})
        return {"status": True, "message": "User rejected and removed."}
    raise HTTPException(status_code=400, detail="Action must be 'approve' or 'reject'.")

# ── Change User Role ─────────────────────────────────────
@router.put("/role")
def change_role(data: RoleModel, request: Request):
    require_admin(request)
    db = get_db()
    db.vgulg_users.update_one({"_id": data.user_id}, {"$set": {"role": data.role}})
    return {"status": True, "message": f"User role changed to {data.role}."}

# ── Add Foundation ID to verified list ───────────────────
@router.post("/foundation-id")
def add_foundation_id(data: FoundationIDModel, request: Request):
    require_admin(request)
    db = get_db()
    if db.foundation_ids.find_one({"foundation_id": data.foundation_id}):
        raise HTTPException(status_code=400, detail="Foundation ID already exists.")
    db.foundation_ids.insert_one({"_id": str(ObjectId()), "foundation_id": data.foundation_id, "member_name": data.member_name})
    return {"status": True, "message": f"Foundation ID {data.foundation_id} added."}

# ── Get All Foundation IDs ───────────────────────────────
@router.get("/foundation-ids")
def get_foundation_ids(request: Request):
    require_admin(request)
    db = get_db()
    ids = list(db.foundation_ids.find({}))
    return {"status": True, "result": ids}

# ── Delete Foundation ID ─────────────────────────────────
@router.delete("/foundation-id/{fid}")
def delete_foundation_id(fid: str, request: Request):
    require_admin(request)
    db = get_db()
    db.foundation_ids.delete_one({"foundation_id": fid})
    return {"status": True, "message": f"Foundation ID {fid} deleted."}

# ── Monitor All Jobs ─────────────────────────────────────
@router.get("/jobs")
def all_jobs(request: Request):
    require_admin(request)
    db = get_db()
    jobs = list(db.vgulg_jobs.find({}).sort("created_at", -1))
    return {"status": True, "result": jobs}

# ── Delete Any Job ───────────────────────────────────────
@router.delete("/jobs/{job_id}")
def delete_any_job(job_id: str, request: Request):
    require_admin(request)
    db = get_db()
    db.vgulg_jobs.delete_one({"_id": job_id})
    return {"status": True, "message": "Job deleted by admin."}

# ── Recruiter Applications List ──────────────────────────
@router.get("/recruiter-applications")
def get_recruiter_applications(request: Request):
    require_admin(request)
    db = get_db()
    apps = list(db.recruiter_applications.find({}).sort("created_at", -1))
    return {"status": True, "result": apps}

# ── Recruiter Application Action ────────────────────────
@router.post("/recruiter-applications/action")
def action_recruiter_application(data: RecruiterAppActionModel, request: Request):
    require_admin(request)
    db = get_db()

    app = db.recruiter_applications.find_one({"_id": data.application_id})
    if not app:
        raise HTTPException(status_code=404, detail="Recruiter application not found.")

    if data.action == "reject":
        db.recruiter_applications.update_one(
            {"_id": data.application_id},
            {"$set": {"status": "rejected"}}
        )
        return {"status": True, "message": "Application rejected successfully."}

    elif data.action == "approve":
        if not data.foundation_id or not data.password:
            raise HTTPException(status_code=400, detail="Foundation ID and Password are required to approve.")

        foundation_id = data.foundation_id.strip().upper()

        # Check if foundation_id or email already registered
        if db.vgulg_users.find_one({"foundation_id": foundation_id}):
            raise HTTPException(status_code=400, detail="This Foundation ID is already in use.")

        email = app["email"].strip().lower()
        if db.vgulg_users.find_one({"email": email}):
            raise HTTPException(status_code=400, detail="This email is already registered as an account.")

        if len(data.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

        # Create recruiter user account
        new_recruiter = {
            "_id": str(ObjectId()),
            "username": app["username"].strip(),
            "foundation_id": foundation_id,
            "email": email,
            "password": pwd_ctx.hash(data.password),
            "role": "recruiter",
            "is_approved": True,
            "skills": [],
            "education": "",
            "experience": "",
            "location": app.get("location", "").strip(),
            "resume": "",
            "bio": app.get("message", "").strip(),
            "company_name": app["company_name"].strip(),
            "company_website": app.get("company_website", "").strip(),
            "designation": app.get("designation", "").strip(),
            "phone": app.get("phone", "").strip(),
            "created_at": datetime.utcnow().isoformat(),
        }
        db.vgulg_users.insert_one(new_recruiter)

        # Update application status
        db.recruiter_applications.update_one(
            {"_id": data.application_id},
            {"$set": {"status": "approved", "assigned_foundation_id": foundation_id}}
        )
        print(f"✅ Recruiter approved by admin: {foundation_id} for email: {email}")
        return {"status": True, "message": f"Recruiter approved! Account {foundation_id} created."}

    raise HTTPException(status_code=400, detail="Invalid action. Use 'approve' or 'reject'.")
