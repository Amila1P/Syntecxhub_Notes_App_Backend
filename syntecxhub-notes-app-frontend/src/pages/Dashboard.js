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
        container: { padding: '40px 20px', maxWidth: '1100px', margin: 'auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' },
        logoutBtn: { backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
        formCard: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' },
        formContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
        input: { width: '100%', maxWidth: '500px', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', boxSizing: 'border-box' },
        addBtn: { width: '100%', maxWidth: '500px', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
        errorMessage: { color: '#dc3545', fontSize: '13px', textAlign: 'center', marginTop: '10px', padding: '12px', backgroundColor: '#f8d7da', borderRadius: '4px', border: '1px solid #f5c6cb', maxWidth: '500px', width: '100%', boxSizing: 'border-box' },
        successMessage: { color: '#155724', fontSize: '13px', textAlign: 'center', marginTop: '10px', padding: '12px', backgroundColor: '#d4edda', borderRadius: '4px', border: '1px solid #c3e6cb', maxWidth: '500px', width: '100%', boxSizing: 'border-box' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
        noteCard: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '5px solid #007bff', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
        noteTitle: { margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333' },
        noteDesc: { color: '#666', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' },
        deleteBtn: { alignSelf: 'flex-end', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
    };

    return (
        <div style={styles.container}>
            {/* Debug Monitor */}
            <div style={{background: '#333', color: '#0f0', padding: '10px', fontSize: '11px', borderRadius: '5px', marginBottom: '10px', fontFamily: 'monospace', maxHeight: '60px', overflowY: 'auto'}}>
                Total: {notes.length} | Archived: {notes.filter(n => n.isArchived === true).length} | Active: {notes.filter(n => n.isArchived === false).length}
            </div>

            <div style={styles.header}>
                <h1 style={{ color: '#2c3e50', margin: 0 }}>My Workspace 📝</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => navigate('/profile')} style={{ ...styles.logoutBtn, background: '#6c757d', marginRight: '10px' }}>Profile</button>
                    <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
                </div>
            </div>

            {/* Form */}
            <div style={styles.formCard}>
                <h3 style={{ marginTop: 0, textAlign: 'center' }}>{editId ? "Update Note" : "Create New Note"}</h3>
                <form onSubmit={handleAddNote} style={styles.formContainer}>
                    <input style={styles.input} type="text" placeholder="Note Title..." value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea style={{ ...styles.input, height: '100px', resize: 'vertical' }} placeholder="Write your content here..." value={content} onChange={(e) => setContent(e.target.value)} required />
                    <button type="submit" style={styles.addBtn}>{editId ? "Update Note" : "Save Note"}</button>
                    {message.type === 'error' && <p style={styles.errorMessage}>{message.text}</p>}
                    {message.type === 'success' && <p style={styles.successMessage}>{message.text}</p>}
                </form>
            </div>

            {/* Active Notes Section */}
            <h2 style={{ color: '#34495e', marginBottom: '20px' }}>Recent Notes</h2>
            <div style={styles.grid}>
                {notes.filter(note => note.isArchived === false).length > 0 ? (
                    notes.filter(note => note.isArchived === false).map(note => (
                        <div key={note._id} style={styles.noteCard}>
                            <div>
                                <h3 style={styles.noteTitle}>{note.title}</h3>
                                <p style={styles.noteDesc}>{note.content}</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                <button onClick={() => handleArchive(note._id)} style={{ ...styles.deleteBtn, color: '#ffc107', borderColor: '#ffc107' }}>Archive</button>
                                <button onClick={() => handleEditClick(note)} style={{ ...styles.deleteBtn, color: '#007bff', borderColor: '#007bff' }}>Edit</button>
                                <button onClick={() => handleDelete(note._id)} style={styles.deleteBtn}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#999' }}>No active notes.</p>
                )}
            </div>

            {/* Archive Toggle */}
            <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                <button onClick={() => setShowArchive(!showArchive)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {showArchive ? "▲ Hide Archived Notes" : "▼ View Archived Notes"}
                </button>
            </div>

            {/* Archived Notes Section */}
            {showArchive && (
                <div style={{ marginTop: '30px' }}>
                    <h2 style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '25px' }}>Archived Notes 📁</h2>
                    <div style={styles.grid}>
                        {notes.filter(note => note.isArchived === true).length > 0 ? (
                            notes.filter(note => note.isArchived === true).map(note => (
                                <div key={note._id} style={{ ...styles.noteCard, borderTopColor: '#6c757d', background: '#f9f9f9', opacity: 0.8 }}>
                                    <div>
                                        <h3 style={styles.noteTitle}>{note.title}</h3>
                                        <p style={styles.noteDesc}>{note.content}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                        <button onClick={() => handleArchive(note._id)} style={{ ...styles.deleteBtn, color: '#28a745', borderColor: '#28a745' }}>Unarchive</button>
                                        <button onClick={() => handleDelete(note._id)} style={styles.deleteBtn}>Delete</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#999' }}>Your archive is empty.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;