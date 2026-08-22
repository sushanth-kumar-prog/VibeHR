from fastapi import APIRouter, Depends
from ..core.deps import get_current_user
from ..models.user import User
import datetime

router = APIRouter(prefix="/notifications", tags=["notifications"])

# In-memory mock store (would be DB + Supabase + SMTP in prod)
_notifications = []

def add_notification(company_id: str, title: str, message: str, type: str = "info"):
    _notifications.append({
        "id": len(_notifications)+1,
        "company_id": str(company_id),
        "title": title,
        "message": message,
        "type": type,
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    })
    # Mock email alert: print to server log (would send via SMTP/Supabase)
    print(f"[EMAIL ALERT] {title}: {message}")

@router.get("")
async def list_notifications(current: User = Depends(get_current_user)):
    # return latest 20 for company
    filtered = [n for n in _notifications if n["company_id"] == str(current.company_id)]
    return filtered[-20:][::-1]

@router.post("/test")
async def test_notif(payload: dict, current: User = Depends(get_current_user)):
    add_notification(current.company_id, payload.get("title","Test"), payload.get("message","Hello"), payload.get("type","info"))
    return {"sent": True}
