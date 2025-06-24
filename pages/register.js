import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
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
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Welcome to Food Bridge!');
        // Reset form
        setForm({ username: '', email: '', password: '' });
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/login'); // You can change this to wherever you want to redirect
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
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
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: 8 }}>Join Food Bridge</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 24, fontSize: 14 }}>
        Help reduce food waste and support communities in Malaysia
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: 8, 
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14
            }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
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
            Password (minimum 6 characters)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            disabled={loading}
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: '#4caf50', textDecoration: 'none', fontWeight: 'bold' }}>
          Sign in here
        </a>
      </p>
    </div>
  );
}
