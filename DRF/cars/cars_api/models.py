from datetime import date

from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=200)

    class Meta:
        db_table = 'car_shop_category'

    def __str__(self):
        return self.name


class Advertisment(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10,
                                decimal_places=2, null=True, blank=True)
    publish_date = models.DateField(default=date.today, null=True, blank=True)
    slug = models.SlugField(max_length=1000, null=True, blank=True)
    category = models.ForeignKey(Category,
                                 on_delete=models.CASCADE,
                                 null=True, blank=True)

    class Meta:
        db_table = 'car_shop_advertisment'
        ordering = ('publish_date',)

    def __str__(self):
        return self.title

    def save(self, *args, **kwrags):
        self.slug = slugify(self.title)
        super(Advertisment, self).save(*args, **kwrags)


class UploadedAdvertisment(models.Model):

    image = models.ImageField(default='default.png',
                              upload_to='advertisment_photos',
                              max_length=1000, blank=True, null=True)

    uploaded_by_user = models.ForeignKey(User,
                                         related_name='uploaded_advertisments',
                                         on_delete=models.CASCADE)
    advertisment = models.OneToOneField(Advertisment,
                                        related_name='uploaded_advertisment',
                                        on_delete=models.CASCADE, blank=True)

    class Meta:
        db_table = 'car_shop_uploaded_advertisment'


class ScrapedAdvertisment(models.Model):

    source = models.CharField(max_length=100, null=True, blank=True)
    image_url = models.CharField(max_length=1000, null=True, blank=True)
    advertisment_url = models.CharField(max_length=1000,
                                        null=True, blank=True, unique=True)

    advertisment = models.OneToOneField(Advertisment,
                                        related_name='scraped_advertisment',
                                        on_delete=models.CASCADE, blank=True)

    class Meta:
        db_table = 'car_shop_scraped_advertisment'
