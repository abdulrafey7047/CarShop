import json

from django.db.models import Count
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from .models import Advertisment


ADVERTISMENT_COUNT_GROUP_NAME = 'advertisment-count-group'


class AdvertismentConsumer(WebsocketConsumer):

    def connect(self):

        self.room_group_name = ADVERTISMENT_COUNT_GROUP_NAME

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        json_data = json.dumps(
            {'payload': {
                'type': 'connection established',
                'total_advertisment_count': Advertisment.objects.all().count(),
                'advertisments_by_date': list(
                    Advertisment.objects.all().values('publish_date').annotate(
                        total=Count('publish_date')).order_by('publish_date')
                    )[-15:]}
             },
            default=str
        )
        self.send(text_data=json_data)

    def receive(self, text_data=None, bytes_data=None):
        return super().receive(text_data, bytes_data)

    def disconnect(self, code):

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def advertisment_created(self, event):
        data = json.dumps(
            {'payload': event['data']},
            default=str
        )

        self.send(text_data=data)
