from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status


@api_view(['POST'])
def Logout(request):
    try:
        if '2FA' in request.session:
            del request.session['2FA']
        return Response({'detail': 'Logged out!'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'detail': 'Logged out!'}, status=status.HTTP_200_OK)
