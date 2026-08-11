import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import deleteIcon from '../assets/delete.png'; 
import "../styles/Habits.css";

function Habit({habit, onDelete, onUpdate}){
    const[completedToday, setCompletedToday] = useState(habit.today_log_id ? true : false)
    const[loading, setLoading] = useState(false)
    const[logId, setLogId] = useState(habit.today_log_id || null)

    const handleLogHabit = async (isCompleted) =>{
        setLoading(true);
        if(!completedToday){
            const today = new Date().toISOString().split('T')[0];
            try{
                const res = await api.post('/api/habit-logs/',{
                    "habit": habit.id,
                    "completed_at": today
                });
                if (res.status === 201){
                    setCompletedToday(true);
                    setLogId(res.data.id);
                    onUpdate();
                }
            } catch(error){
                alert("Could not log the habit" + error.message)
            } finally{
                setLoading(false)
            }
        } else{
            try{
                const res = await api.delete(`/api/habit-logs/${logId}/`);
                if(res.status === 204){
                    setCompletedToday(false)
                    setLogId(null)
                    onUpdate();
                }
            } catch(error){
                alert("Could not remove log of the habit" + error.message)
            } finally{
                setLoading(false)
            }
        }
    }

    return(
        <div className="single-habit">
            <button className="update-habit-button" title="Update habit">✏️</button>
            <p className="habit-title" style={{color:habit.color}}>
                {habit.title}
            </p>
            <p className="habit-streak" title="Habit streak">
                {habit.current_streak}
            </p>
            <button className="habit-log-button" title="Log habit" onClick={()=>{handleLogHabit(completedToday)}} disabled={loading}>
                {completedToday ? '❤️' : '🩶'}
            </button>
            <button className="delete-habit-button" onClick={()=>{onDelete(habit.id)}}>
                <img src={deleteIcon} alt="Delete habit" />
            </button>
        </div>
    )
}

function HabitsList(){
    const [habits, setHabits] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        getHabits();
    }, [])
    
    const getHabits = async ()=>{
        try{
            const res = await api.get('/api/habits/');
            setHabits(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteHabit = async (id) =>{
        try{
            const res = await api.delete(`/api/habits/${id}/`);
            if (res.status === 204) {
                alert("Habit deleted!");
                setHabits(habits.filter((habit) => habit.id !== id));
            }
        } catch (error){
            alert("Error occured");
        }
    }

    return (
        <div className="habits-container">
            <div className="habits-header-row">
            <h1 className="habits-header">MY HABITS</h1>
            <button className="add-habit-button" onClick={()=>{navigate('/create-habit')}}>Add New Habit</button>
            </div>
            <div className="habits-list">
                {habits.map((habit)=>(
                    <Habit key={habit.id} habit={habit} onDelete={deleteHabit} onUpdate={getHabits}/>
                ))}
            </div>

            {habits.length === 0 && (
                <>
                <p className="no-habits-text">You don't have any habits yet</p>
                <p className="no-habits-text">Let's create your first habit</p>
                </>
            )}
        </div>
    )
}

export default HabitsList;