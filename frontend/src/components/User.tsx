import { useState, useEffect } from 'react';
import { fetchUser } from '../services/user.service';

function User() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchUser()
      .then((data) => setUsername(data.username))
      .catch((error) => {
        console.log('Cannot get username', error);
        setUsername('Error');
      });
  }, []);

  return <h1 className="username-text">{username}</h1>;
}

export default User;
