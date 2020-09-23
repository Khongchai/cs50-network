from django.contrib import admin
from network.models import *

# Register your models here.
class CommentAdmin(admin.ModelAdmin):
    list_display = ("commentedWhen", "commentedBy", "commentedOn", "commentBody")

admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comment, CommentAdmin)

