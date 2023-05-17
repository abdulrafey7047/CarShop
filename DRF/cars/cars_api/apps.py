from django.apps import AppConfig


class CarsApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cars_api'

    def ready(self):
        import cars_api.signals

