from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

class SignupCompanyRequest(BaseModel):
    companyName: str
    adminFirstName: str
    adminLastName: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

class LoginRequest(BaseModel):
    email: str  # email or employee_id
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class InviteEmployeeRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    jobTitle: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    role: str = "employee" # admin/hr/employee
