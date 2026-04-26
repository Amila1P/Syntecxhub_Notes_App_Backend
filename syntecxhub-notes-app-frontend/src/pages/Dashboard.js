import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editId, setEditId] = useState(null);
    const [showArchive, setShowArchive] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const fetchNotes = async () => {
        try {
            const res = await API.get('/notes');
            // Debugging: Backend එකෙන් එන දත්ත වල හැඩය console එකේ බලන්න
            console.log("Fetched Notes:", res.data); 
            setNotes(res.data);
        } catch (err) {
            console.error("Error fetching notes", err);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleEditClick = (note) => {
        setEditId(note._id);
        setTitle(note.title);
        setContent(note.content);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            console.log("Adding note:", { title, content, editId });
            
            if (editId) {
                const response = await API.put(`/notes/${editId}`, { title, content });
                console.log("Update response:", response.data);
                setEditId(null); 
                setMessage({ type: 'success', text: 'Note updated successfully!' });
            } else {
                const response = await API.post('/notes', { title, content });
                console.log("Create response:", response.data);
                setMessage({ type: 'success', text: 'Note created successfully!' });
            }
            setTitle('');
            setContent('');
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            await fetchNotes();
        } catch (err) {
            const errorMsg = editId ? "Failed to update note: " + (err.response?.data?.msg || err.message) : "Failed to add note: " + (err.response?.data?.msg || err.message);
            setMessage({ type: 'error', text: errorMsg });
            console.error("Error saving note:", err.response?.data || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            try {
                await API.delete(`/notes/${id}`);
                fetchNotes();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const handleArchive = async (id) => {
        try {
            // Find the note to check if it's already archived
            const note = notes.find(n => n._id === id);
            const endpoint = note && note.isArchived ? '/notes/unarchive' : '/notes/archive';
            
            const response = await API.put(`${endpoint}/${id}`);
            console.log(`Note ${endpoint}d:`, response.data);
            
            // Refresh notes from server
            fetchNotes();
        } catch (err) {
            console.error("Error archiving/unarchiving note", err);
        }
    };

    const styles = {
        container: { 
            padding: '100px 20px 40px 20px',
            maxWidth: '1200px', 
            margin: 'auto', 
            fontFamily: "'Inter', 'Poppins', sans-serif",
            position: 'relative',
            zIndex: 1
        },
        header: { 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '15px 40px',
            zIndex: 100
        },
        headerTitle: {
            color: '#1a1a1a',
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            zIndex: 101,
            textShadow: '0px 1px 3px rgba(255, 255, 255, 0.5)'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
        },
        profileBtn: { 
            background: 'rgba(100, 200, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(100, 200, 255, 0.3)',
            color: '#a8d5ff',
            padding: '8px 18px', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontSize: '14px'
        },
        logoutBtn: { 
            background: 'rgba(255, 107, 107, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            color: '#ff8888',
            padding: '8px 18px', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontSize: '14px'
        },
        formCard: { 
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
            padding: '35px', 
            borderRadius: '20px', 
            marginBottom: '50px', 
            maxWidth: '650px', 
            margin: '0 auto 50px auto'
        },
        formTitle: {
            textAlign: 'center',
            color: '#222222',
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '25px',
            letterSpacing: '-0.3px',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.8)'
        },
        formContainer: { 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
        },
        input: { 
            width: '100%', 
            maxWidth: '550px',
            padding: '14px 16px', 
            marginBottom: '15px', 
            borderRadius: '12px', 
            border: 'none',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            fontSize: '16px',
            color: '#000000',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease',
            fontWeight: '500'
        },
        textarea: {
            width: '100%', 
            maxWidth: '550px',
            padding: '14px 16px',
            marginBottom: '15px',
            borderRadius: '12px',
            border: 'none',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            fontSize: '16px',
            color: '#000000',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            resize: 'vertical',
            height: '120px',
            transition: 'all 0.3s ease',
            fontWeight: '500'
        },
        addBtn: { 
            width: '100%', 
            maxWidth: '550px',
            padding: '14px', 
            marginTop: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: '700',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        },
        addBtnHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)'
        },
        errorMessage: { 
            color: '#ff8888', 
            fontSize: '13px', 
            textAlign: 'center', 
            marginTop: '10px', 
            padding: '12px', 
            background: 'rgba(255, 107, 107, 0.12)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 107, 107, 0.25)',
            backdropFilter: 'blur(10px)',
            maxWidth: '550px', 
            width: '100%', 
            boxSizing: 'border-box'
        },
        successMessage: { 
            color: '#51cf66', 
            fontSize: '13px', 
            textAlign: 'center', 
            marginTop: '10px', 
            padding: '12px', 
            background: 'rgba(81, 207, 102, 0.12)',
            borderRadius: '10px',
            border: '1px solid rgba(81, 207, 102, 0.25)',
            backdropFilter: 'blur(10px)',
            maxWidth: '550px', 
            width: '100%', 
            boxSizing: 'border-box'
        },
        sectionTitle: {
            color: '#222222',
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '25px',
            marginTop: '40px',
            letterSpacing: '-0.3px',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.8)'
        },
        grid: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
        },
        noteCard: { 
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderLeft: '5px solid #6366f1',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            padding: '20px', 
            borderRadius: '18px',
            transition: 'all 0.3s ease',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            color: '#000000',
            cursor: 'pointer',
            overflow: 'hidden'
        },
        noteCardHover: {
            transform: 'scale(1.03)',
            background: 'rgba(255, 255, 255, 0.18)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
            borderLeftColor: '#818cf8',
            borderColor: 'rgba(100, 200, 255, 0.6)'
        },
        noteCardArchived: {
            background: 'rgba(255, 255, 255, 0.08)',
            opacity: 0.8,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderLeft: '5px solid #999999',
            overflow: 'hidden'
        },
        noteTitle: { 
            margin: '0 0 12px 0', 
            fontSize: '1.35rem', 
            color: '#000000',
            fontWeight: '700',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.5)'
        },
        noteDesc: { 
            color: '#222222', 
            fontSize: '0.95rem', 
            lineHeight: '1.6', 
            marginBottom: '20px',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            fontWeight: '400',
            textShadow: '0px 1px 1px rgba(255, 255, 255, 0.4)'
        },
        buttonBar: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '6px',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            flexWrap: 'nowrap',
            alignItems: 'center',
            minWidth: 0
        },
        action: (color) => ({
            padding: '5px 10px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: `1.5px solid ${color}`,
            background: `rgba(255, 255, 255, 0.12)`,
            color: color,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
            flex: '1 1 auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            whiteSpace: 'nowrap',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }),
        emptyState: {
            textAlign: 'center',
            gridColumn: '1 / -1',
            color: '#555555',
            fontSize: '1.1rem',
            padding: '40px 20px',
            fontWeight: '500'
        },
        archiveToggle: {
            background: 'rgba(108, 117, 125, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(108, 117, 125, 0.3)',
            color: '#b0b8c1',
            padding: '12px 28px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            marginTop: '50px',
            marginBottom: '30px'
        },
        archiveToggleHover: {
            background: 'rgba(108, 117, 125, 0.3)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(108, 117, 125, 0.2)'
        },
        archivedSection: {
            marginTop: '50px',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        },
        archivedTitle: {
            textAlign: 'center',
            color: '#222222',
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '25px',
            letterSpacing: '-0.3px',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.8)'
        },
        debugMonitor: {
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#000000',
            padding: '14px 18px',
            fontSize: '13px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontFamily: "'Inter', 'Poppins', sans-serif",
            maxHeight: '50px',
            overflowY: 'auto',
            transition: 'all 0.3s ease',
            fontWeight: '700',
            textShadow: '0px 1px 2px rgba(255, 255, 255, 0.6)',
            boxShadow: '0 4px 15px rgba(31, 38, 135, 0.1)'
        }
    };

    return (
        <div style={styles.container}>
            {/* Debug Monitor */}
            <div style={styles.debugMonitor}>
                📊 Total: {notes.length} | 📁 Archived: {notes.filter(n => n.isArchived === true).length} | ⭐ Active: {notes.filter(n => n.isArchived === false).length}
            </div>

            {/* Fixed Header */}
            <div style={styles.header}>
                <h1 style={styles.headerTitle}>📝 My Workspace</h1>
                <div style={styles.buttonGroup}>
                    <button 
                        onClick={() => navigate('/profile')} 
                        style={styles.profileBtn}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(100, 200, 255, 0.3)';
                            e.target.style.boxShadow = '0 4px 15px rgba(100, 200, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(100, 200, 255, 0.2)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        👤 Profile
                    </button>
                    <button 
                        style={styles.logoutBtn} 
                        onClick={() => { localStorage.clear(); navigate('/login'); }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 107, 107, 0.3)';
                            e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 107, 107, 0.2)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Form Card */}
            <div style={styles.formCard}>
                <h3 style={styles.formTitle}>{editId ? "✏️ Update Note" : "✨ Create New Note"}</h3>
                <form onSubmit={handleAddNote} style={styles.formContainer}>
                    <input 
                        style={styles.input} 
                        type="text" 
                        placeholder="📌 Note Title..." 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                            e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.5)';
                            e.target.style.boxShadow = '0 0 15px rgba(100, 200, 255, 0.3)';
                        }}
                        onBlur={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
                            e.target.style.boxShadow = 'none';
                        }}
                        required 
                    />
                    <textarea 
                        style={styles.textarea}
                        placeholder="✍️ Write your content here..." 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                            e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.5)';
                            e.target.style.boxShadow = '0 0 15px rgba(100, 200, 255, 0.3)';
                        }}
                        onBlur={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
                            e.target.style.boxShadow = 'none';
                        }}
                        required 
                    />
                    <button 
                        type="submit" 
                        style={styles.addBtn}
                    >
                        {editId ? "💾 Update Note" : "➕ Save Note"}
                    </button>
                    {message.type === 'error' && <p style={styles.errorMessage}>{message.text}</p>}
                    {message.type === 'success' && <p style={styles.successMessage}>{message.text}</p>}
                </form>
            </div>

            {/* Active Notes Section */}
            <h2 style={styles.sectionTitle}>⭐ Recent Notes</h2>
            <div style={styles.grid}>
                {notes.filter(note => note.isArchived === false).length > 0 ? (
                    notes.filter(note => note.isArchived === false).map(note => (
                        <div 
                            key={note._id} 
                            style={styles.noteCard}
                        >
                            <div>
                                <h3 style={styles.noteTitle}>{note.title}</h3>
                                <p style={styles.noteDesc}>{note.content}</p>
                            </div>
                            <div style={styles.buttonBar}>
                                <button 
                                    onClick={() => handleArchive(note._id)} 
                                    style={styles.action('#ffc107')}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255, 193, 7, 0.15)';
                                        e.target.style.boxShadow = '0 0 12px rgba(255, 193, 7, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    📦 Archive
                                </button>
                                <button 
                                    onClick={() => handleEditClick(note)} 
                                    style={styles.action('#a8d5ff')}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(100, 200, 255, 0.15)';
                                        e.target.style.boxShadow = '0 0 12px rgba(100, 200, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(note._id)} 
                                    style={styles.action('#ff8888')}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255, 107, 107, 0.15)';
                                        e.target.style.boxShadow = '0 0 12px rgba(255, 107, 107, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={styles.emptyState}>📭 No active notes. Create one to get started!</p>
                )}
            </div>

            {/* Archive Toggle */}
            <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '30px' }}>
                <button 
                    onClick={() => setShowArchive(!showArchive)} 
                    style={styles.archiveToggle}
                >
                    {showArchive ? "▲ Hide Archived Notes" : "▼ View Archived Notes"}
                </button>
            </div>

            {/* Archived Notes Section */}
            {showArchive && (
                <div style={styles.archivedSection}>
                    <h2 style={styles.archivedTitle}>📁 Archived Notes</h2>
                    <div style={styles.grid}>
                        {notes.filter(note => note.isArchived === true).length > 0 ? (
                            notes.filter(note => note.isArchived === true).map(note => (
                                <div 
                                    key={note._id} 
                                    style={{
                                        ...styles.noteCard,
                                        ...styles.noteCardArchived
                                    }}
                                >
                                    <div>
                                        <h3 style={styles.noteTitle}>{note.title}</h3>
                                        <p style={styles.noteDesc}>{note.content}</p>
                                    </div>
                                    <div style={styles.buttonBar}>
                                        <button 
                                            onClick={() => handleArchive(note._id)} 
                                            style={styles.action('#51cf66')}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(81, 207, 102, 0.15)';
                                                e.target.style.boxShadow = '0 0 12px rgba(81, 207, 102, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'transparent';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            🔄 Unarchive
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(note._id)} 
                                            style={styles.action('#ff8888')}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(255, 107, 107, 0.15)';
                                                e.target.style.boxShadow = '0 0 12px rgba(255, 107, 107, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'transparent';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={styles.emptyState}>📭 Your archive is empty.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;