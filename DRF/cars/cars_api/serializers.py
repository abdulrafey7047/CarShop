from django.contrib.auth.models import User
from django.forms.models import model_to_dict


from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .tasks import (
    send_user_email_about_account_update,
)
from .models import (
    Advertisment, UploadedAdvertisment,
    ScrapedAdvertisment, Category
)
from .utilities import (
    create_uploaded_advertisment,
    update_advertisment, update_uploaded_avertisment,
    update_user
)


class UploadedAdvertismentSerializer(serializers.ModelSerializer):

    class Meta:
        model = UploadedAdvertisment
        fields = '__all__'


class ScrapedAdvertismentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ScrapedAdvertisment
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'


class AdvertismentSerializer(serializers.ModelSerializer):

    uploaded_advertisment = UploadedAdvertismentSerializer()
    scraped_advertisment = ScrapedAdvertismentSerializer()
    category = CategorySerializer()

    class Meta:
        model = Advertisment
        fields = ('id', 'title', 'slug', 'description', 'price',
                  'publish_date', 'category', 'uploaded_advertisment',
                  'scraped_advertisment')

    def create(self, validated_data):
        category_name = validated_data.pop('category')['name'].lower()
        category, _ = Category.objects.get_or_create(name=category_name)
        validated_data['category'] = category

        uploaded_advertisment_data = validated_data.pop(
            'uploaded_advertisment')
        validated_data['scraped_advertisment'] = None

        advertisment_instance = self.Meta.model(**validated_data)
        advertisment_instance.save()

        create_uploaded_advertisment(
            uploaded_advertisment_data, advertisment_instance)

        return advertisment_instance

    def update(self, instance, validated_data):
        category_name = validated_data.pop('category')['name']
        category, _ = Category.objects.get_or_create(name=category_name)
        validated_data['category'] = category

        uploaded_advertisment_data = validated_data.pop(
            'uploaded_advertisment')
        validated_data['scraped_advertisment'] = None

        advertisment_instance = update_advertisment(validated_data, instance)
        print(uploaded_advertisment_data)
        uploaded_avertisment = update_uploaded_avertisment(
            uploaded_advertisment_data,
            advertisment_instance.uploaded_advertisment)

        advertisment_instance.save()
        uploaded_avertisment.save()

        return advertisment_instance


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'email', 'password',
                  'first_name', 'last_name',)
        extra_kwargs = {
            'password': {'write_only': True},
            }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        validated_data.pop('password')
        instance = update_user(validated_data, instance)
        instance.save()

        if instance.email:
            send_user_email_about_account_update.delay(instance.email)
        return instance


class GoogleLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(required=True)
    first_name = serializers.CharField(required=False, default='')
    last_name = serializers.CharField(required=False, default='')


class TokenObtainPairSerializer(TokenObtainSerializer):

    @classmethod
    def get_token(cls, user):
        return RefreshToken.for_user(user)

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        user = User.objects.filter(pk=self.user.id).first()
        if user:
            data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }

        return data
