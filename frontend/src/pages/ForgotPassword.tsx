import { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { passReset } from '../services/auth.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const slowServerWarning = setTimeout(() => {
      alert('The server is waking up. Please wait...');
    }, 4000);

    try {
      await passReset(email);
      clearTimeout(slowServerWarning);
      setMessage(
        'If the email exists in our system, a password reset link has been sent.'
      );
      setEmail('');
    } catch (error) {
      clearTimeout(slowServerWarning);
      if (axios.isAxiosError(error) && error.response?.data) {
        if (error.response.data.email) {
          setError(error.response.data.email[0]);
        } else {
          setError('Error occured. Please check for typos.');
        }
      } else {
        setError('Uknown error. Please try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-form">
      <form onSubmit={handleSubmit} className="form-container">
        <h3>Password Reset</h3>
        {message && (
          <p className="form-paragraph" style={{ color: 'green' }}>
            {message}
          </p>
        )}
        {error && (
          <p className="form-paragraph" style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <label htmlFor="email-input" className="form-label">
          Email
        </label>
        <input
          id="email-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />

        <button className="form-button" type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Send Reset Link'}
        </button>
        <p className="form-paragraph">
          <Link to="/login">Return to Login</Link>
        </p>
      </form>
    </div>
  );
}
