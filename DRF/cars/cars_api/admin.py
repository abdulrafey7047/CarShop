from django.contrib import admin

from .models import (
    Advertisment, Category,
    ScrapedAdvertisment, UploadedAdvertisment
)


admin.site.register(Advertisment)
admin.site.register(Category)
admin.site.register(ScrapedAdvertisment)
admin.site.register(UploadedAdvertisment)
