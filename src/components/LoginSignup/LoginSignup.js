import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignup.css';

const LoginSignup = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      if (!isSignup) {
        localStorage.setItem('authToken', response.data.token);
        onLogin();
      } else {
        alert('Signup successful! Please login.');
        setIsSignup(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-signup">
      <form onSubmit={handleSubmit}>
        <h2>{isSignup ? 'Signup' : 'Login'}</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isSignup ? 'Signup' : 'Login'}</button>
        <p onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
        </p>
      </form>
    </div>
  );
};

export default LoginSignup;
