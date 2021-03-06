# Generated by Django 3.0.8 on 2020-09-16 10:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='following',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='followers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Posts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('postBody', models.TextField()),
                ('postedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='postsByThisUser', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Likes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('likedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='likesByThisUser', to=settings.AUTH_USER_MODEL)),
                ('likedOn', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likesOnThisPost', to='network.Posts')),
            ],
        ),
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('commentBody', models.TextField()),
                ('commentedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='commentsByThisUser', to=settings.AUTH_USER_MODEL)),
                ('commentedOn', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commentsOnThisPost', to='network.Posts')),
            ],
        ),
    ]
