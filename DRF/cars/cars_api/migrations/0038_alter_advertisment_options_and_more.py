# Generated by Django 4.1 on 2022-09-12 05:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cars_api', '0037_rename_search_vector_advertisment_search'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='advertisment',
            options={'ordering': ('-publish_date',)},
        ),
        migrations.RemoveField(
            model_name='advertisment',
            name='search',
        ),
    ]
