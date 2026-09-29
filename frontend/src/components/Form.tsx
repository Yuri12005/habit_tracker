import { useState, SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Form.css';
import { authenticateUser } from '../services/auth.service';
import axios from 'axios';

interface FormProps {
  method: string;
}

function Form({ method }: FormProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === 'login' ? 'Login' : 'Register';
  const handleSubmit = async (e: SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();

    const slowServerWarning = setTimeout(() => {
      alert('The server is waking up. Please wait...');
    }, 4000);

    try {
      if (method === 'register') {
        await authenticateUser({ username, email, password }, method);
      } else if (method === 'login') {
        await authenticateUser({ username, password }, method);
      }
      clearTimeout(slowServerWarning);
      navigate('/');
    } catch (error) {
      clearTimeout(slowServerWarning);
      if (axios.isAxiosError(error) && error.response?.data) {
        if (error.response.data.username) {
          alert(error.response.data.username[0]);
        } else if (error.response.data.email) {
          alert(error.response.data.email[0]);
        } else if (error.response.data.detail) {
          alert(error.response.data.detail);
        } else {
          alert('An uknown error occurred. Please try again.');
        }
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      {name === 'Register' && (
        <label htmlFor="email-input" className="form-label">
          Email
        </label>
      )}
      {name === 'Register' && (
        <input
          id="email-input"
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        ></input>
      )}
      <label htmlFor="username-input" className="form-label">
        {method === 'login' ? 'Email or Username' : 'Username'}
      </label>
      <input
        id="username-input"
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={method === 'login' ? 'Email or Username' : 'Username'}
      />
      <label htmlFor="password-input" className="form-label">
        Password
      </label>
      <input
        id="password-input"
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="form-button" type="submit" disabled={Loading}>
        {Loading ? <span className="spinner"></span> : name}
      </button>
      {method === 'login' ? (
        <>
          <p className="form-paragraph">
            Don`t have an account? <Link to="/register">Register</Link>
          </p>
          <p className="form-paragraph">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </>
      ) : (
        <p className="form-paragraph">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      )}
    </form>
  );
}

export default Form;
