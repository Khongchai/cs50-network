# Generated by Django 3.0.8 on 2020-09-19 06:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0008_user_likedposts'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Like',
        ),
    ]
