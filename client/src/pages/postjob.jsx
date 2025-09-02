import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function PostJob() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: 0,
        type: '',
        status: ''
    });

    const handleSubmit = () => {
        // Validation: all fields required
        const { title, company, location, description, salary, type, status } = formData;
        if (!title || !company || !location || !description || !salary || !type || !status) {
            alert("Please fill in all fields.");
            return;
        }
        const jobData = { ...formData, salary: parseInt(salary, 10) };
        axios.post("http://localhost:3000/jobs", jobData)
            .then(response => {
                console.log("Job posted successfully:", response.data);
                navigate('/job'); 
            })
            .catch(error => {
                console.error("Error posting job:", error);
            });
    };
       
    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f7f7f7' }}>
            <div style={{ background: '#fff', padding: '2rem 2.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Post a Job</h2>
                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Job Title</label>
                        <input type='text' value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} placeholder='Job Title' />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Company</label>
                        <input type='text' value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} placeholder='Company' />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Location</label>
                        <input type='text' value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} placeholder='Location' />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }} placeholder='Description' />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Salary</label>
                        <input type='number' value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} placeholder='Salary' />
                    </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Type</label>
                                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                                                    <option value="">Select Type</option>
                                                    <option value="Full-time">Full-time</option>
                                                    <option value="INTERNS">INTERNS</option>
                                                    <option value="CONTRACT">CONTRACT</option>
                                                </select>
                                        </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Status</label>
                        <input type='text' value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} placeholder='Status (e.g. open)' />
                    </div>
                    <button type='submit' style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Create Job
                    </button>
                </form>
            </div>
        </div>
            // ...existing code...
            );

}

export default PostJob