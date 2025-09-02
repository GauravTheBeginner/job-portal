import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })
  const  navigate = useNavigate();
  const handleSubmit = async() =>{
    try {
      const response = await axios.post("http://localhost:3000/register", formData);
      console.log(response.data);
      alert("Registered successfully")
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f7f7f7' }}>
      <div style={{ background: '#fff', padding: '2rem 2.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: '100%', maxWidth: '350px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Register</h2>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="Enter your name"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" style={{ width: '104%', padding: '0.75rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register