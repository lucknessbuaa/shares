# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='shares',
            name='createon',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 7, 7, 12, 55, 928064, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
