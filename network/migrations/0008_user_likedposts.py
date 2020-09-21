# Generated by Django 3.0.8 on 2020-09-19 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0007_post_likes'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='likedPosts',
            field=models.ManyToManyField(related_name='likedBy', to='network.Post'),
        ),
    ]