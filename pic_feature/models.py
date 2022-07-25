from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class imageUpload(models.Model):
    uploadImg = models.ImageField(default='property_post.jpg', upload_to='images/')