import requests

from django.conf import settings
from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import filters
from rest_framework.generics import (
    RetrieveAPIView, ListAPIView, CreateAPIView,
    UpdateAPIView, RetrieveDestroyAPIView
)

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenViewBase

from .permissions import IsOwnerPermission
from .paginators import CategoryPagination
from .models import (
    Advertisment, Category,
    UploadedAdvertisment
)
from .serializers import (
    AdvertismentSerializer, UserSerializer,
    UserSerializer, UploadedAdvertismentSerializer,
    CategorySerializer,
    TokenObtainPairSerializer,
    GoogleLoginSerializer
)

from .utilities import (
    update_user, apply_category_filter_to_queryset,
    apply_price_filter_to_queryset,
    apply_user_filter_to_queryset,
)


class AdvertismentSearch(ListAPIView):
    queryset = Advertisment.objects.all()
    serializer_class = AdvertismentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['$slug', '$description']


class CategoryList(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = CategoryPagination


class AdvertismentList(ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AdvertismentSerializer

    def get_queryset(self):
        queryset = Advertisment.objects.all()

        category_filters = self.request.query_params.get('category')
        if category_filters:
            queryset = apply_category_filter_to_queryset(
                queryset, category_filters.split())

        price_filters = self.request.query_params.get('price')
        if price_filters:
            queryset = apply_price_filter_to_queryset(
                queryset, price_filters.split())

        user_filter = self.request.query_params.get('user')
        if user_filter:
            queryset = apply_user_filter_to_queryset(
                queryset, self.request.user.id)

        return queryset


class AdvertismentDetial(RetrieveAPIView):
    queryset = Advertisment.objects.all()
    serializer_class = AdvertismentSerializer
    permission_classes = [permissions.AllowAny]


class AdvertismentCreate(CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Advertisment.objects.all()
    serializer_class = AdvertismentSerializer


class AdvertismentUpdate(UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerPermission]
    queryset = Advertisment.objects.all()
    serializer_class = AdvertismentSerializer


class AdvertismentDelete(RetrieveDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerPermission]
    queryset = Advertisment.objects.all()
    serializer_class = AdvertismentSerializer


class UserList(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserGoogleLogin(APIView):

    def post(self, request, *args, **kwargs):
        # Validating login with Google
        id_token = request.data.pop('id_token')
        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/tokeninfo',
            params={'id_token': id_token}
        )

        if not google_response.ok:
            return Response(
                {'detail': 'Error in Communicating with Google Servers'},
                status=status.HTTP_400_BAD_REQUEST)

        audience = google_response.json()['aud']
        if audience != settings.GOOGLE_OAUTH2_CLIENT_ID:
            return Response({'detail': "Couldn't Authenticate with Google"},
                            status=status.HTTP_400_BAD_REQUEST)

        # FETCHING OR CREATING USER IN OUR DB
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.pop('username')
        user, created = User.objects.get_or_create(username=username)
        if created:
            user = update_user(serializer.validated_data, user)
            user.save()

        # Generating Tokens
        refresh = RefreshToken.for_user(user)
        response_data = dict()
        response_data['refresh'] = str(refresh)
        response_data['access'] = str(refresh.access_token)
        response_data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }

        return Response(response_data, status=status.HTTP_200_OK)


class BlacklistTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            token = RefreshToken(request.data['refresh_token'])
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)


class TokenObtainPairView(TokenViewBase):
    """
    Takes a set of user credentials and returns access and refresh JSON web
    token pair to prove the authentication of those credentials.
    """

    serializer_class = TokenObtainPairSerializer
