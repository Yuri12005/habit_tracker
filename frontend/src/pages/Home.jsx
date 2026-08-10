import User from '../components/User'
import HabitsList from '../components/Habits'
import LogoutNav from '../components/Logout'
import "../styles/Home.css"

function Home(){
    return <div className="home-page-container">
        <div className="top-container">
        <User />
        <LogoutNav />
        </div>
        <HabitsList />
        </div>
}

export default Home