import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { name, email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await API.post('/auth/register', { name, email, password });
            setSuccess('Registration Successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' },
        card: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '350px' },
        input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
        button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
        error: { color: '#dc3545', fontSize: '13px', textAlign: 'center', marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px', border: '1px solid #f5c6cb' },
        success: { color: '#155724', fontSize: '13px', textAlign: 'center', marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', border: '1px solid #c3e6cb' },
        linkText: { textAlign: 'center', marginTop: '15px', fontSize: '13px', color: '#555' },
        link: { color: '#007bff', fontWeight: 'bold', marginLeft: '5px', textDecoration: 'underline', transition: 'color 0.2s ease' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: 'center' }}>Register</h2>
                <form onSubmit={handleRegister}>
                    <input type="text" name="name" placeholder="Name" style={styles.input} value={name} onChange={onChange} required />
                    <input type="email" name="email" placeholder="Email Address" style={styles.input} value={email} onChange={onChange} required />
                    <input type="password" name="password" placeholder="Password" style={styles.input} value={password} onChange={onChange} required />
                    <button type="submit" style={styles.button}>Register</button>
                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}
                </form>
                <p style={styles.linkText}>
                    Already have an account? 
                    <span 
                        onClick={() => navigate('/login')} 
                        style={styles.link}
                        onMouseEnter={(e) => e.target.style.color = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.color = '#007bff'}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;