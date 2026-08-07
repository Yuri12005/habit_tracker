from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Habit(models.Model):
    class HabitColor(models.TextChoices):
        RED = 'red'
        BLUE = 'blue'
        MAGENTA = 'magenta'
        BLACK = 'black'
        ORANGE = 'orange'
        DARKGREEN = 'darkgreen'
    title = models.CharField(max_length=100)
    color = models.CharField(choices=HabitColor.choices, max_length=10, default=HabitColor.BLUE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default = True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    
    def __str__(self):
        return f"{self.id} - {self.title}"

class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    completed_at = models.DateField()

    class Meta:
        unique_together = ('habit', 'completed_at')

    def __str__(self):
        return f"{self.habit} (Completed at: {self.completed_at})"