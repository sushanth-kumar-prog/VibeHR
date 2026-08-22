import os
import uuid

# Supabase storage helper — uses supabase-py if credentials exist, else local fallback
# Buckets: company-logos, avatars, employee-documents, leave-docs

def get_supabase_client():
    try:
        from supabase import create_client
        from ..core.config import settings
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
            return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    except Exception:
        pass
    return None

async def upload_bytes(bucket: str, filename: str, content: bytes, content_type: str = "application/octet-stream") -> str:
    client = get_supabase_client()
    if client:
        try:
            # supabase-py storage upload (sync)
            res = client.storage.from_(bucket).upload(filename, content, {"content-type": content_type, "upsert": "true"})
            # get public URL
            pub = client.storage.from_(bucket).get_public_url(filename)
            return pub
        except Exception as e:
            print(f"Supabase upload failed ({bucket}/{filename}): {e} — fallback to local")
    # local fallback
    local_dir = os.path.join("uploads", bucket)
    os.makedirs(local_dir, exist_ok=True)
    path = os.path.join(local_dir, filename)
    with open(path, "wb") as f:
        f.write(content)
    # return local path (frontend will prefix with API)
    return f"/{path.replace(os.sep, '/')}"

def is_supabase_configured() -> bool:
    return get_supabase_client() is not None
