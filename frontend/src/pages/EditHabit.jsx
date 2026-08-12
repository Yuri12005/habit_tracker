import HabitForm from "../components/HabitForm";
import api from "../api";
import { useNavigate, useLocation} from "react-router-dom";

export default function EditHabit(){
    const location = useLocation()
    const navigate = useNavigate()
    const {method, habit} = location.state || {}

    return <HabitForm 
        method = {method}
        habit = {habit}
        />
}