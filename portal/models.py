from django.db import models

from django.db import models
from django.contrib.auth.models import User

class Shares(models.Model):
    user = models.ForeignKey(User)
    imageurl = models.TextField(verbose_name=u'imageURL')
    info = models.TextField(verbose_name=u'info')
    createon = models.DateTimeField()
