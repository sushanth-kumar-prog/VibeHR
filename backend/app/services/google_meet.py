import os
import uuid
import re
from datetime import datetime, timezone
from typing import Optional

def _mock_meet_link() -> str:
    part = lambda: uuid.uuid4().hex[:3]
    return f"https://meet.google.com/{part()}-{part()}{part()[:1]}-{part()}"

def _sanitize(text: str) -> str:
    # basic XSS strip tags
    return re.sub(r'<[^>]*>', '', text).strip()

async def create_calendar_event_with_meet(
    title: str,
    description: str,
    start_time: datetime,
    end_time: datetime,
    attendee_emails: list[str],
    organizer_email: str | None = None,
) -> tuple[str, str | None]:
    """
    Try to create Google Calendar event with Meet link.
    Returns (meet_link, calendar_event_id).
    Falls back to mock if credentials not configured.
    """
    # sanitize
    title = _sanitize(title)
    description = _sanitize(description) if description else ""

    # Check for service account
    sa_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    calendar_id = os.getenv("GOOGLE_CALENDAR_ID", "primary")

    # If not configured, fallback mock
    if not sa_path or not os.path.exists(sa_path):
        # try env var JSON inline?
        sa_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON_CONTENT")
        if not sa_json:
            return _mock_meet_link(), f"mock_{uuid.uuid4().hex[:8]}"

    try:
        # Lazy import to avoid hard dependency if not installed
        from google.oauth2 import service_account
        from googleapiclient.discovery import build

        SCOPES = ["https://www.googleapis.com/auth/calendar"]
        creds = service_account.Credentials.from_service_account_file(sa_path, scopes=SCOPES)
        service = build("calendar", "v3", credentials=creds)

        event = {
            "summary": title,
            "description": description,
            "start": {"dateTime": start_time.isoformat(), "timeZone": "UTC"},
            "end": {"dateTime": end_time.isoformat(), "timeZone": "UTC"},
            "attendees": [{"email": e} for e in attendee_emails],
            "conferenceData": {
                "createRequest": {
                    "requestId": uuid.uuid4().hex,
                    "conferenceSolutionKey": {"type": "hangoutsMeet"}
                }
            },
        }
        # add organizer as attendee? not needed
        created = service.events().insert(
            calendarId=calendar_id,
            body=event,
            conferenceDataVersion=1,
            sendUpdates="all"
        ).execute()

        meet_link = None
        cal_id = created.get("id")
        conf = created.get("conferenceData", {})
        for ep in conf.get("entryPoints", []):
            if ep.get("entryPointType") == "video":
                meet_link = ep.get("uri")
                break
        if not meet_link:
            meet_link = created.get("hangoutLink") or _mock_meet_link()
        return meet_link, cal_id
    except Exception as e:
        print(f"[MEET] Google Calendar failed, fallback mock: {e}")
        return _mock_meet_link(), f"mock_{uuid.uuid4().hex[:8]}"

def generate_instant_meet_link() -> tuple[str, str]:
    """Generate instant meet link + event id (mock or real)"""
    return _mock_meet_link(), f"instant_{uuid.uuid4().hex[:8]}"
