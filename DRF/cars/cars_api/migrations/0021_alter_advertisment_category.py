# Generated by Django 4.1 on 2022-09-08 08:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cars_api', '0020_rename_scrapedadvertisment2_scrapedadvertisment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advertisment',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='cars_api.category'),
        ),
    ]
