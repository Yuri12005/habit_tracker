from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

class JWTCustomMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_authenticator = JWTAuthentication()

    def __call__(self, request):
        try:
            auth_result = self.jwt_authenticator.authenticate(request)

            if auth_result is not None:
                user, token = auth_result

                request.user = user

            else:
                pass

        except (InvalidToken, AuthenticationFailed) as e:
            return JsonResponse({
                'error' : 'Invalid or expired token',
                'details': str(e)
            }, status= 401)

        return self.get_response(request)