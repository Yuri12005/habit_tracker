import os
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django_rest_passwordreset.signals import reset_password_token_created

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    
    reset_password_url = f"{frontend_url}/reset-password?token={reset_password_token.key}"

    email_subject = "Password Reset Request"
    email_body = f"Hello,\n\nYou have requested to reset your password. Please click the link below to reset your password:\n\n{reset_password_url}\n\nIf you did not request this, please ignore this email.\n\nThank you."

    send_mail(
        subject=email_subject,
        message=email_body,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[reset_password_token.user.email],
        fail_silently=False,
    )