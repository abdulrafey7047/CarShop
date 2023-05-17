# Generated by Django 4.1 on 2022-09-07 11:47

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cars_api', '0011_alter_advertisment_price_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advertisment',
            name='advertisment_url',
            field=models.CharField(blank=True, max_length=300, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='advertisment',
            name='publish_date',
            field=models.DateField(blank=True, default=datetime.date.today, null=True),
        ),
        migrations.AlterField(
            model_name='testadvertisment',
            name='advertisment_url',
            field=models.CharField(blank=True, max_length=300, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='testadvertisment',
            name='publish_date',
            field=models.DateField(blank=True, default=datetime.date.today, null=True),
        ),
    ]
