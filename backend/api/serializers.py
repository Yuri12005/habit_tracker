from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Habit, HabitLog
from datetime import date, timedelta

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']

        extra_kwargs = {
            'password' : {'write_only' : True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class HabitSerializer(serializers.ModelSerializer):
    current_streak = serializers.SerializerMethodField()
    class Meta:
        model = Habit
        fields = ['id', 'title', 'color', 'created_at', 'is_active', 'user', 'current_streak']

        extra_kwargs = {
            'id': {'read_only' : True},
            'created_at': {'read_only': True},
            'user' : {'read_only' : True}
        }

    def get_current_streak(self, obj):
        logs = obj.logs.order_by('-completed_at')

        if not logs:
            return 0

        streak = 0
        check_date = date.today()

        if logs.first().completed_at not in [check_date, check_date-timedelta(days=1)]:
            return 0
        
        for log in logs:
            if log.completed_at == check_date:
                streak += 1
                check_date -= timedelta(days=1)
            elif log.completed_at > check_date:
                continue
            else:
                break
        return streak


class HabitLogSerializer(serializers.ModelSerializer):
    color = serializers.CharField(source='habit.color', read_only = True)
    habit_name = serializers.CharField(source='habit.title', read_only = True)

    class Meta:
        model = HabitLog
        fields = ['id', 'habit', 'completed_at', 'color', 'habit_name']