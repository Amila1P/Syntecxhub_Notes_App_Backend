import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();

    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'Email not found';

    const styles = {
        container: { 
            padding: '40px 20px', 
            maxWidth: '500px', 
            margin: '100px auto', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            position: 'relative',
            zIndex: 1
        },
        card: { 
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '45px 35px', 
            borderRadius: '20px', 
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', 
            textAlign: 'center',
            color: '#fff'
        },
        avatar: { 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '48px', 
            fontWeight: 'bold', 
            margin: '0 auto 25px',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
        },
        infoTitle: { 
            margin: '15px 0 10px 0', 
            color: '#333333', 
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.8)'
        },
        infoEmail: { 
            color: '#444444', 
            fontSize: '16px', 
            marginBottom: '30px',
            fontWeight: '500',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.8)'
        },
        divider: {
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '25px',
            marginTop: '25px'
        },
        button: { 
            padding: '12px 28px', 
            borderRadius: '12px', 
            border: 'none', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', 
            cursor: 'pointer', 
            fontWeight: '700',
            transition: 'all 0.3s ease',
            fontSize: '16px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.avatar}>
                    {userName.charAt(0).toUpperCase()}
                </div>

                <h2 style={styles.infoTitle}>👤 {userName}</h2>
                <p style={styles.infoEmail}>{userEmail}</p>
                
                <div style={styles.divider}>
                    <button 
                        onClick={() => navigate('/')} 
                        style={styles.button}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;