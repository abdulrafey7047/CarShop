# Generated by Django 4.1 on 2022-09-07 11:49

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cars_api', '0014_delete_testadvertisment'),
    ]

    operations = [
        migrations.CreateModel(
            name='TestAdvertisment2',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('price', models.CharField(blank=True, max_length=50, null=True)),
                ('category', models.CharField(blank=True, max_length=1000, null=True)),
                ('publish_date', models.DateField(blank=True, default=datetime.date.today, null=True)),
                ('image', models.ImageField(default='default.png', upload_to='advertisment_photos')),
                ('advertisment_url', models.CharField(blank=True, max_length=300, null=True, unique=True)),
                ('uploaded_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'test_advertisment_2',
                'ordering': ['-publish_date'],
            },
        ),
    ]