# Generated by Django 4.1 on 2022-09-11 13:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cars_api', '0036_advertisment_search_vector'),
    ]

    operations = [
        migrations.RenameField(
            model_name='advertisment',
            old_name='search_vector',
            new_name='search',
        ),
    ]
