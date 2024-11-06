import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Prefill the username and password fields
  useEffect(() => {
    setFormData({ email: 'user@example.com', password: 'password' });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here, e.g., authentication with the provided credentials.
    // If login is successful, redirect to the dashboard.
    // Replace the following line with your logic:
    if (formData.email === 'user@example.com' && formData.password === 'password') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
