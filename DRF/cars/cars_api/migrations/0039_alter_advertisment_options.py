# Generated by Django 4.1 on 2022-09-12 05:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cars_api', '0038_alter_advertisment_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='advertisment',
            options={'ordering': ('publish_date',)},
        ),
    ]