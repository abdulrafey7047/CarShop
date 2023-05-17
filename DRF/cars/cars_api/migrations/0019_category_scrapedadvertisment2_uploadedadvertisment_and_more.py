# Generated by Django 4.1 on 2022-09-08 08:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cars_api', '0018_advertisment_scraped_image_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
            options={
                'db_table': 'car_shop_category',
            },
        ),
        migrations.CreateModel(
            name='ScrapedAdvertisment2',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.CharField(blank=True, max_length=50, null=True)),
                ('image_url', models.CharField(blank=True, max_length=1000, null=True)),
                ('advertisment_url', models.CharField(blank=True, max_length=1000, null=True, unique=True)),
            ],
            options={
                'db_table': 'car_shop_scraped_advertisment',
            },
        ),
        migrations.CreateModel(
            name='UploadedAdvertisment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('image', models.ImageField(default='default.png', max_length=1000, upload_to='advertisment_photos')),
            ],
            options={
                'db_table': 'car_shop_uploaded_advertisment',
            },
        ),
        migrations.AlterModelOptions(
            name='advertisment',
            options={},
        ),
        migrations.RemoveField(
            model_name='advertisment',
            name='advertisment_url',
        ),
        migrations.RemoveField(
            model_name='advertisment',
            name='image',
        ),
        migrations.RemoveField(
            model_name='advertisment',
            name='price',
        ),
        migrations.RemoveField(
            model_name='advertisment',
            name='scraped_image',
        ),
        migrations.RemoveField(
            model_name='advertisment',
            name='uploaded_by',
        ),
        migrations.AlterField(
            model_name='advertisment',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterModelTable(
            name='advertisment',
            table='car_shop_advertisment',
        ),
        migrations.DeleteModel(
            name='TestAdvertisment2',
        ),
        migrations.AddField(
            model_name='uploadedadvertisment',
            name='advertisment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cars_api.advertisment'),
        ),
        migrations.AddField(
            model_name='uploadedadvertisment',
            name='uploaded_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='scrapedadvertisment2',
            name='advertisment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cars_api.advertisment'),
        ),
    ]
