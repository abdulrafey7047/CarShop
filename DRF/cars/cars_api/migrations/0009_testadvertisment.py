# Generated by Django 4.1 on 2022-09-07 11:04

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cars_api', '0008_advertisment_advertisment_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='TestAdvertisment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('price', models.CharField(blank=True, max_length=10, null=True)),
                ('category', models.CharField(blank=True, max_length=100, null=True)),
                ('publish_date', models.DateField(default=datetime.date.today)),
                ('image', models.ImageField(default='default.png', upload_to='advertisment_photos')),
                ('advertisment_url', models.CharField(blank=True, max_length=300, null=True)),
                ('uploaded_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'test_advertisment',
                'ordering': ['-publish_date'],
            },
        ),
    ]
