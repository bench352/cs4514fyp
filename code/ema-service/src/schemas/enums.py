import enum


class Role(enum.Enum):
    LANDLORD = "LANDLORD"
    RESIDENT = "RESIDENT"


class FilterByFlatOwnership(enum.Enum):
    ALL = "ALL"
    OWNED = "OWNED"
    NOT_OWNED = "NOT_OWNED"


class TokenType(enum.Enum):
    BEARER = "Bearer"
