from django.urls import path
from . import views

urlpatterns =[
    path('habits/', views.HabitListCreate.as_view(), name = 'habit-list'),
    path('habits/<int:pk>/', views.HabitDetail.as_view(), name = 'habit-detail'),
    path('habit-logs/', views.HabitLogListCreate.as_view(), name = 'habit-log'),
    path('habit-logs/delete/<int:pk>/', views.HabitLogDelete.as_view(), name = 'habit-log-delete')
]