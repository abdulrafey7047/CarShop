import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cars.settings')

application = get_asgi_application()

# Importing here to avoid "django.core.exceptions.AppRegistryNotReady: Apps aren't loaded yet"
from cars_api.routing import websocket_urlpatterns


application = ProtocolTypeRouter({
    "http": application,
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    )
})
