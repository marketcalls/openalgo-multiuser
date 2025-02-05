from tortoise import fields
from tortoise.models import Model
from datetime import datetime

# Add your Tortoise ORM models here

class User(Model):
    id = fields.IntField(pk=True)
    email = fields.CharField(max_length=255, unique=True, index=True)
    username = fields.CharField(max_length=255, unique=True, index=True)
    hashed_password = fields.CharField(max_length=255)
    is_active = fields.BooleanField(default=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "users"

    def __str__(self):
        return self.username
