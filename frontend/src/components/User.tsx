import { useState, useEffect } from 'react';
import api from '../api';

function User() {
  const [username, setUsername] = useState('');

  const fetchUser = async () => {
    try {
      const res = await api.get('/api/user/me/');
      setUsername(res.data.username);
    } catch (error) {
      console.log('Can`t get username', error);
      setUsername('Error');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <h1 className="username-text">{username}</h1>;
}

export default User;
