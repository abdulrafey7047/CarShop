from typing import List

from django.db.models.query import QuerySet
from django.db.models import Q, Count


from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import UploadedAdvertisment, Category, Advertisment
from .consumers import ADVERTISMENT_COUNT_GROUP_NAME


price_filter_ranges = {
    '1': {'range': [0, 1000000]},
    '2': {'range': [1000000, 5000000]},
    '3': {'range': [5000000, 10000000]},
    '4': {'range': [10000000, float('inf')]},
}


def create_uploaded_advertisment(data, advertisment_instance):

    if data['image']:
        uploaded_advertisment = UploadedAdvertisment.objects.create(
            image=data['image'],
            uploaded_by_user=data['uploaded_by_user'],
            advertisment=advertisment_instance
        )
    else:
        uploaded_advertisment = UploadedAdvertisment.objects.create(
            uploaded_by_user=data['uploaded_by_user'],
            advertisment=advertisment_instance
        )

    return uploaded_advertisment


def update_advertisment(validated_data, advertisment_instance):

    for attr, value in validated_data.items():
        setattr(advertisment_instance, attr, value)

    return advertisment_instance


def update_uploaded_avertisment(validated_data,
                                uploaded_advertisment_instance):

    for attr, value in validated_data.items():
        if value:
            setattr(uploaded_advertisment_instance, attr, value)
    
    return uploaded_advertisment_instance


def update_user(validated_data, user_instance):

    for attr, value in validated_data.items():
        setattr(user_instance, attr, value)

    return user_instance


def apply_category_filter_to_queryset(queryset: QuerySet,
                                      category_filters: List) -> QuerySet:

    category_ids = Category.objects.values_list(
        'id').filter(name__in=category_filters)
    queryset = queryset.filter(category__in=category_ids)

    return queryset


def apply_price_filter_to_queryset(queryset: QuerySet,
                                   price_filters: List) -> QuerySet:

    query_filter = Q()
    for price_filter_id in price_filters:
        range = price_filter_ranges[price_filter_id]['range']
        query_filter = query_filter | Q(price__range=range)

    return queryset.filter(query_filter)


def apply_user_filter_to_queryset(queryset: QuerySet,
                                  user_id: int) -> QuerySet:

    return queryset.filter(
            uploaded_advertisment__uploaded_by_user=user_id)


def update_count_for_consumers():

    channel_layer = get_channel_layer()
    data = {
        'total_advertisment_count': Advertisment.objects.all().count(),
        'advertisments_by_date': list(
            Advertisment.objects.all().values('publish_date').annotate(
                total=Count('publish_date')).order_by('publish_date')
            )[-15:]
    }

    async_to_sync(channel_layer.group_send)(
        ADVERTISMENT_COUNT_GROUP_NAME,
        {
            'type': 'advertisment_created',
            'data': data,
        }
    )
