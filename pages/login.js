import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({
    identifier: '', // Can be username or email
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Welcome back, ${data.user.username}!`);
        
        // Store user info in localStorage (you might want to use a more secure method)
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
          router.push('/dashboard'); // Change this to your desired redirect page
        }, 1500);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '2rem auto', 
      padding: 24, 
      border: '1px solid #eee', 
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: 8 }}>Welcome Back</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 24, fontSize: 14 }}>
        Sign in to your Food Bridge account
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="identifier" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Username or Email
          </label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter your username or email"
            style={{ 
              width: '100%', 
              padding: 8, 
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14
            }}
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter your password"
            style={{ 
              width: '100%', 
              padding: 8, 
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14
            }}
          />
        </div>
        
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            backgroundColor: '#ffebee', 
            padding: 10, 
            borderRadius: 4, 
            marginBottom: 16,
            fontSize: 14,
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            color: '#2e7d32', 
            backgroundColor: '#e8f5e8', 
            padding: 10, 
            borderRadius: 4, 
            marginBottom: 16,
            fontSize: 14,
            border: '1px solid #c8e6c9'
          }}>
            {success}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: 12, 
            backgroundColor: loading ? '#ccc' : '#4caf50', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <p style={{ fontSize: 14, color: '#666' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#4caf50', textDecoration: 'none', fontWeight: 'bold' }}>
            Create one here
          </a>
        </p>
        
        <p style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
          <a href="/forgot-password" style={{ color: '#999', textDecoration: 'none' }}>
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
} 