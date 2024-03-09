from pydantic import BaseModel


class DecodedUserDetail(BaseModel):
    username: str
    role: str
