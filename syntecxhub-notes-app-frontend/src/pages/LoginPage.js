import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await API.post('/auth/login', { email, password });
                localStorage.setItem('token', res.data.token);
            
            if (res.data.user) {
                localStorage.setItem('userName', res.data.user.name);
                localStorage.setItem('userEmail', res.data.user.email);
            }

            setSuccess('Login Successful! Redirecting...');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        }
    };

    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' },
        card: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '350px' },
        input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
        button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
        error: { color: '#dc3545', fontSize: '13px', textAlign: 'center', marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px', border: '1px solid #f5c6cb' },
        success: { color: '#155724', fontSize: '13px', textAlign: 'center', marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', border: '1px solid #c3e6cb' },
        linkText: { marginTop: '20px', fontSize: '13px', color: '#555', textAlign: 'center' },
        link: { color: '#007bff', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px', textDecoration: 'underline', transition: 'color 0.2s ease' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: 'center' }}>Login</h2>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        style={styles.input} 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        style={styles.input} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" style={styles.button}>Login</button>
                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}
                </form>

                <p style={styles.linkText}>
                    Don't have an account? 
                    <span 
                        onClick={() => navigate('/register')} 
                        style={styles.link}
                        onMouseEnter={(e) => e.target.style.color = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.color = '#007bff'}
                    >
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;