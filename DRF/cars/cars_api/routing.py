from django.urls import re_path

from .consumers import AdvertismentConsumer


websocket_urlpatterns = [
    re_path('ws/advertisment-count', AdvertismentConsumer.as_asgi())
]
