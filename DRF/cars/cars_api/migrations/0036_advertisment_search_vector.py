# Generated by Django 4.1 on 2022-09-11 13:27

import django.contrib.postgres.search
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cars_api', '0035_scrapedadvertisment_source'),
    ]

    operations = [
        migrations.AddField(
            model_name='advertisment',
            name='search_vector',
            field=django.contrib.postgres.search.SearchVectorField(null=True),
        ),
    ]
