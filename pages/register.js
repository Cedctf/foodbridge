import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useUser } from '../contexts/UserContext';

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
  const { login } = useUser();

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
        setSuccess('Registration successful! Logging you in...');
        
        // Automatically log in the user after successful registration
        const loginResult = await login({
          identifier: form.username, // Use username for login
          password: form.password
        });

        if (loginResult.success) {
          // Redirect to profile after successful auto-login
          setTimeout(() => {
            router.push('/profile');
          }, 1500);
        } else {
          // If auto-login fails, redirect to login page
          setSuccess('Registration successful! Please log in.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
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
      display: 'flex',
      justifyContent: 'center',
      margin: '2rem auto',
      maxWidth: '800px',
      padding: '0 24px'
    }}>
      {/* Left Box */}
      <div style={{ 
        flex: 1,
        maxWidth: 400,
        position: 'relative',
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee',
        borderLeft: '1px solid #eee',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        boxShadow: '-2px 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Image
          src="/images/register-leftbox.png"
          alt="Food Bridge Registration"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Right Box (Register Form) */}
      <div style={{ 
        flex: 1,
        maxWidth: 400,
        padding: 24, 
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee',
        borderRight: '1px solid #eee',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
      }}>
      <h2 style={{ textAlign: 'center', color: '#000000', marginBottom: 8 }}>Join Food Bridge</h2>
      <p style={{ textAlign: 'center', color: '#000000', marginBottom: 24, fontSize: 14 }}>
        Help reduce food waste and support communities in Malaysia
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold', color: '#000000' }}>
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
              fontSize: 14,
              color: '#000000'
            }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold', color: '#000000' }}>
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
              fontSize: 14,
              color: '#000000'
            }}
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold', color: '#000000' }}>
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
              fontSize: 14,
              color: '#000000'
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
    </div>
  );
}
