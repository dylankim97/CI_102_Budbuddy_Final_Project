import datetime
from django.db import models
from django.contrib.auth.models import User





class Favorite_Ride(models.Model):
    destination = models.CharField(default='', max_length=200)
    username = models.CharField(default='', max_length=200)

    def __str__(self):
        return self.username



