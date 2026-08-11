import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import '../styles/CreateHabit.css'

export default function CreateHabit(){
    const [title, setTitle] = useState('')
    const [color, setColor] = useState('') 
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        setLoading(true);
        e.preventDefault();
        try{
            const res = await api.post('/api/habits/', {title, color})
            if (res.status===201){
                navigate('/')
            }
        } catch (error) {
            alert(error)
        } finally{
            setLoading(false)
        }

    }

    return (
        <div className='create-form-container'>
            <form className='habit-form' onSubmit={handleSubmit}>
                <h1>Create habit</h1>
                <label htmlFor="title-input" className='form-label'>Title</label>
                <input id="title-input" className='form-input' type='text' value={title} placeholder='Title' onChange={(e)=>{setTitle(e.target.value)}} />
                <label htmlFor='colors' className='form-label'>Color</label>
                <select className="select-colors" id='colors' value={color} onChange={(e)=>setColor(e.target.value)}>
                    <option value='red'>Red</option>
                    <option value='blue'>Blue</option>
                    <option value='magenta'>Magenta</option>
                    <option value='black'>Black</option>
                    <option value='orange'>Orange</option>
                    <option value='darkgreen'>Dark green</option>
                </select>
                <div className='button-form-container'>
                <button className="create-form-button" type="submit" disabled={loading}>CREATE</button>
                <button className='return-form-button' type="button" onClick={()=>navigate('/')} disabled={loading}>Return</button>
                </div>
            </form>
        </div>
    )
}