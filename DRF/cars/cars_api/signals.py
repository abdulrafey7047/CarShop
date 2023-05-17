from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Count

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Advertisment
from .consumers import ADVERTISMENT_COUNT_GROUP_NAME
from .utilities import update_count_for_consumers


@receiver(post_save, sender=Advertisment)
def update_count_on_save(sender, instance, created, **kwargs):

    if created:
        update_count_for_consumers()


@receiver(post_delete, sender=Advertisment)
def update_count_on_delete(sender, instance, **kwargs):

    update_count_for_consumers()
