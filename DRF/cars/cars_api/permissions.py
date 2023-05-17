from rest_framework import permissions
from django.core.exceptions import ObjectDoesNotExist


class IsOwnerPermission(permissions.BasePermission):
    message = 'Editing/Deleting is only allowed for publisher of addvertisment'

    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        try:
            return (
              obj.uploaded_advertisment.uploaded_by_user.id == request.user.id
            )
        except ObjectDoesNotExist:
            return False
