from pydantic import BaseModel, ConfigDict, EmailStr

class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None

class CustomerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    company: str | None