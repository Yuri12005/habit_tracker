import { useState, SyntheticEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { confirmPassReset } from '../services/auth.service';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token.');
      setLoading(false);
      return;
    }

    try {
      await confirmPassReset(token, password);
      setMessage('Password has been successfully reset. You can now login.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        if (error.response.data.password) {
          setError(error.response.data.password[0]);
        } else if (error.response.data.token) {
          setError('Invalid or expired token. Please request a new link.');
        } else {
          setError('Error occurred. Please try again.');
        }
      } else {
        setError('Unknown error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-form">
      <form className="form-container" onSubmit={handleSubmit}>
        <h3>Set New Password</h3>

        {message && (
          <p className="form-paragraph form-message" style={{ color: 'green' }}>
            {message}
          </p>
        )}
        {error && (
          <p className="form-paragraph form-error" style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <label htmlFor="password-input" className="form-label">
          New Password
        </label>
        <input
          id="password-input"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />

        <label htmlFor="confirm-password-input" className="form-label">
          Confirm Password
        </label>
        <input
          id="confirm-password-input"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input"
          required
        />

        <button
          className="form-button"
          type="submit"
          disabled={loading || !token}
        >
          {loading ? <span className="spinner"></span> : 'Reset Password'}
        </button>

        <p className="form-paragraph">
          <Link to="/login">Return to Login</Link>
        </p>
      </form>
    </div>
  );
}
