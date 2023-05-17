from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import TokenRefreshView

from cars_api.views import TokenObtainPairView

urlpatterns = [
    path('admin/',
          admin.site.urls
    ),
    path('api/',
          include('cars_api.urls')
    ),
    path('api-auth/',
         include('rest_framework.urls')
    ),
    path('api/token/',
         TokenObtainPairView.as_view(),
         name='token_obtain_pair'
    ),
    path('api/token/refresh/',
         TokenRefreshView.as_view(),
         name='token_refresh'
    ),
]
