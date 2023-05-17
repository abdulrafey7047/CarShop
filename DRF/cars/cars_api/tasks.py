from celery import shared_task
from celery.utils.log import get_task_logger

from django.core.mail import send_mail


logger = get_task_logger(__name__)


@shared_task
def send_user_email_about_account_update(user_email):
    send_mail(
        subject='You Changed Your Account Information',
        message='Hey! Looks like you just updated your account information',
        from_email=None,
        recipient_list=[user_email],
        fail_silently=False,
    )
    logger.info(f'User Account Update email sent to {user_email}')
    return user_email

