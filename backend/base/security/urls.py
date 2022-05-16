from django.urls import path
from rest_framework import routers
from rest_framework.authtoken import views
from rest_framework_simplejwt.views import TokenRefreshView

from . import endpoints

router = routers.DefaultRouter(trailing_slash=True)

urlpatterns = [
    path('api/new-password/', endpoints.new_password),
    path('api/reset-password/', endpoints.reset_password),
    path('api/registrate-yourself/', endpoints.registrate_yourself),
    path('api/api-token-auth/', views.obtain_auth_token),
    path(
        'api/token/',
        endpoints.TokenObtainPairViewBlocking.as_view(),
        name='token_obtain_pair'
    ),
    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    path(
        'api/send_sms_token/',
        endpoints.GetSmsTokenLogin,
        name='send_sms_token'
    ),
    path(
        'api/check_sms_token/',
        endpoints.ValidateSmsToken,
        name='check_sms_token'
    ),
    path(
        'api/send_sms_token_2FA/',
        endpoints.GetSmsToken2FA,
        name='send_sms_token_2FA'
    ),
    path(
        'api/logout/',
        endpoints.Logout,
        name='logout'
    ),
]
