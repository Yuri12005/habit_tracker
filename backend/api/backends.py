from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.db.models import Q

class EmailOrUsernameBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        login_identifier = kwargs.get('email', username)
        
        try:
            user = User.objects.get(Q(username=login_identifier) | Q(email=login_identifier))
        except User.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        return None