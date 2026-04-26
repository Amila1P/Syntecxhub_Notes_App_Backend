import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [btnHover, setBtnHover] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
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
        container: { 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            position: 'relative',
            zIndex: 1
        },
        card: { 
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '380px',
            color: '#fff'
        },
        input: { 
            width: '100%', 
            padding: '12px 16px', 
            margin: '12px 0', 
            borderRadius: '12px', 
            border: 'none',
            borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            boxSizing: 'border-box',
            fontSize: '16px',
            color: '#000000',
            transition: 'all 0.3s ease',
            outline: 'none',
            fontWeight: '500'
        },
        inputFocus: {
            background: 'rgba(255, 255, 255, 0.15)',
            borderBottomColor: 'rgba(255, 255, 255, 0.6)',
            boxShadow: '0 0 15px rgba(100, 200, 255, 0.3)',
            color: '#000000'
        },
        button: { 
            width: '100%', 
            padding: '12px', 
            marginTop: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            position: 'relative',
            overflow: 'hidden'
        },
        buttonHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)'
        },
        error: { 
            color: '#ff6b6b', 
            fontSize: '13px', 
            textAlign: 'center', 
            marginTop: '10px', 
            padding: '12px', 
            background: 'rgba(255, 107, 107, 0.15)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            backdropFilter: 'blur(10px)'
        },
        success: { 
            color: '#51cf66', 
            fontSize: '13px', 
            textAlign: 'center', 
            marginTop: '10px', 
            padding: '12px', 
            background: 'rgba(81, 207, 102, 0.15)',
            borderRadius: '10px',
            border: '1px solid rgba(81, 207, 102, 0.3)',
            backdropFilter: 'blur(10px)'
        },
        linkText: { 
            marginTop: '25px', 
            fontSize: '14px', 
            color: '#333333', 
            textAlign: 'center',
            fontWeight: '600',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.8)'
        },
        link: { 
            color: '#0052cc',
            cursor: 'pointer', 
            fontWeight: '700', 
            marginLeft: '5px', 
            textDecoration: 'underline',
            transition: 'all 0.2s ease',
            borderBottom: '2px solid transparent',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.8)'
        },
        appBrand: {
            textAlign: 'center',
            marginBottom: '25px',
            paddingBottom: '20px',
            borderBottom: '2px solid rgba(255, 255, 255, 0.15)'
        },
        appBrandName: {
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        },
        appTagline: {
            fontSize: '13px',
            color: '#666666',
            fontWeight: '500',
            letterSpacing: '0.5px',
            margin: 0,
            fontStyle: 'italic',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.5)'
        },
        title: {
            textAlign: 'center',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '10px',
            color: '#333333',
            letterSpacing: '-0.5px',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.8)'
        },
        subtitle: {
            textAlign: 'center',
            fontSize: '13px',
            color: '#444444',
            marginBottom: '25px',
            fontWeight: '500',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.8)'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.appBrand}>
                    <h1 style={styles.appBrandName}>
                        📝 QuickNotes
                    </h1>
                    <p style={styles.appTagline}>Your Second Brain</p>
                </div>
                <h2 style={styles.title}>🔐 Welcome Back</h2>
                <p style={styles.subtitle}>Sign in to access your notes</p>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="📧 Email Address" 
                        style={{
                            ...styles.input,
                            ...(emailFocus ? styles.inputFocus : {})
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="🔑 Password" 
                        style={{
                            ...styles.input,
                            ...(passwordFocus ? styles.inputFocus : {})
                        }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        required 
                    />
                    <button 
                        type="submit" 
                        style={{
                            ...styles.button,
                            ...(btnHover ? styles.buttonHover : {})
                        }}
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                    >
                        Login
                    </button>
                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}
                </form>

                <p style={styles.linkText}>
                    Don't have an account? 
                    <span 
                        onClick={() => navigate('/register')} 
                        style={styles.link}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#003d99';
                            e.target.style.textShadow = '0px 2px 3px rgba(255, 255, 255, 1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = '#0052cc';
                            e.target.style.textShadow = '0px 1px 2px rgba(255, 255, 255, 0.8)';
                        }}
                    >
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;