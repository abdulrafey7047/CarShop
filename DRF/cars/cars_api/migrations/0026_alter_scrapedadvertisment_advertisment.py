# Generated by Django 4.1 on 2022-09-08 10:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cars_api', '0025_alter_uploadedadvertisment_advertisment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='scrapedadvertisment',
            name='advertisment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scraped_advertisment', to='cars_api.advertisment'),
        ),
    ]