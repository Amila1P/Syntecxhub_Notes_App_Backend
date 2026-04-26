import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();

    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'Email not found';

    const styles = {
        container: { 
            padding: '40px', 
            maxWidth: '500px', 
            margin: '50px auto', 
            fontFamily: 'Arial, sans-serif' 
        },
        card: { 
            background: '#fff', 
            padding: '40px', 
            borderRadius: '20px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
            textAlign: 'center' 
        },
        avatar: { 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: '#007bff', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '40px', 
            fontWeight: 'bold', 
            margin: '0 auto 20px' 
        },
        infoTitle: { margin: '10px 0', color: '#333', fontSize: '24px' },
        infoEmail: { color: '#666', fontSize: '16px', marginBottom: '30px' },
        button: { 
            padding: '10px 25px', 
            borderRadius: '8px', 
            border: 'none', 
            background: '#007bff', 
            color: 'white', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            transition: 'background 0.3s'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.avatar}>
                    {userName.charAt(0).toUpperCase()}
                </div>

                <h2 style={styles.infoTitle}>{userName}</h2>
                <p style={styles.infoEmail}>{userEmail}</p>
                
                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button 
                        onClick={() => navigate('/')} 
                        style={styles.button}
                        onMouseOver={(e) => e.target.style.background = '#0056b3'}
                        onMouseOut={(e) => e.target.style.background = '#007bff'}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;