from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, HabitSerializer, HabitLogSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from .models import Habit, HabitLog

class HabitListCreate(generics.ListCreateAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Habit.objects.filter(user=user, is_active = True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HabitDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user = self.request.user, is_active = True)
    
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class HabitLogListCreate(generics.ListCreateAPIView):
    serializer_class = HabitLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return HabitLog.objects.filter(habit__user = user, habit__is_active = True)
    
    def perform_create(self, serializer):
        habit = serializer.validated_data['habit']

        if habit.user != self.request.user:
            raise PermissionDenied('Permission Denied')
        
        if not habit.is_active:
            raise PermissionDenied('Habit was deleted')

        serializer.save()

class HabitLogDelete(generics.DestroyAPIView):
    serializer_class = HabitLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return HabitLog.objects.filter(habit__user = user, habit__is_active = True)
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]