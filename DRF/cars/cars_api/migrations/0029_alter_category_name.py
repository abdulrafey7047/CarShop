# Generated by Django 4.1 on 2022-09-08 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cars_api', '0028_rename_uploaded_by_uploadedadvertisment_uploaded_by_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(max_length=200, unique=True),
        ),
    ]