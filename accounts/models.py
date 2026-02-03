from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    full_name = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=12, unique=True, null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    last_active = models.DateTimeField(default=timezone.now)
    is_verified = models.BooleanField(default=True)
    email = models.EmailField()
    
    class Meta:
        db_table = "accounts_user" 
        ordering = ["-date_joined"]
        
    def __str__(self):
        return self.username