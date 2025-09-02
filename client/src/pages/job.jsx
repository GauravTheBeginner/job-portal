  // Filter states
  
  

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Job() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [applying, setApplying] = useState(false); 
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('');
  const userId = localStorage.getItem("userID");
  // Get unique values for dropdowns
  const jobTypes = Array.from(new Set(jobs.map(j => j.type).filter(Boolean)));
  const locations = Array.from(new Set(jobs.map(j => j.location).filter(Boolean)));
  const types = Array.from(new Set(jobs.map(j => j.jobType || j.type).filter(Boolean)));
  const jobStatuses = Array.from(new Set(jobs.map(j => j.status).filter(Boolean)));

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/jobs');
      setJobs(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      setError('Failed to fetch jobs');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Job Listings</h2>
      <button onClick={() => navigate('/postjob')}>Create Job</button>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All Types</option>
          {types.map((type, idx) => <option key={idx} value={type}>{type}</option>)}
        </select>
        <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All Locations</option>
          {locations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
        </select>
        <select value={jobTypeFilter} onChange={e => setJobTypeFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All Job Types</option>
          {jobTypes.map((jt, idx) => <option key={idx} value={jt}>{jt}</option>)}
        </select>
        <select value={jobStatusFilter} onChange={e => setJobStatusFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All Statuses</option>
          {jobStatuses.map((status, idx) => <option key={idx} value={status}>{status}</option>)}
        </select>
      </div>
      {loading && <p style={{ textAlign: 'center' }}>Loading jobs...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
        {jobs
          .filter(job =>
            (!typeFilter || job.type === typeFilter || job.jobType === typeFilter) &&
            (!locationFilter || job.location === locationFilter) &&
            (!jobTypeFilter || job.type === jobTypeFilter) &&
            (!jobStatusFilter || job.status === jobStatusFilter)
          )
          .map((job, idx) => (
          <div key={idx} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', width: '300px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>{job.title}</h3>
            <p style={{ margin: '0.5rem 0', color: '#555' }}><strong>Company:</strong> {job.company}</p>
            <p style={{ margin: '0.5rem 0', color: '#555' }}><strong>Location:</strong> {job.location}</p>
            <p style={{ margin: '0.5rem 0', color: '#555' }}>{job.description}</p>
            <p style={{ margin: '0.5rem 0', color: '#555' }}><strong>Salary:</strong> {job.salary}</p>
            <p style={{ margin: '0.5rem 0', color: '#555' }}><strong>Type:</strong> {job.type}</p>
            <p style={{ margin: '0.5rem 0', color: '#555' }}><strong>Status:</strong> {job.status}</p>
            {job.status === 'applied' ? (
              <div style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', background: '#ccc', color: '#333', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                Already Applied
              </div>
            ) : (
              <button
                style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => { setSelectedJob(job); setShowApply(true); }}
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Apply Modal */}
      {showApply && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', minWidth: '320px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => { setShowApply(false); setAttachment(null); }}>&times;</button>
            <h3 style={{ marginBottom: '1rem' }}>Apply to {selectedJob?.title}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!attachment) return alert('Please upload an attachment');
              setApplying(true);
              try {
                // 1. Upload attachment
                const formData = new FormData();
                formData.append('userId', userId);
                formData.append('file', attachment);
                const attachRes = await axios.post('http://localhost:3000/attachments', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log(attachRes.data.data[0].id);
                // 2. Apply to job
                await axios.post('http://localhost:3000/apply', {
                  jobId: selectedJob.id,
                  userId,
                  attachmentIds: [attachRes.data.data[0].id]
                });
                alert('Applied successfully!');
                setShowApply(false);
                setAttachment(null);
                setLoading(true);
                await fetchJobs();
              } catch (err) {
                console.log(err)
                alert('Failed to apply.');
              }
              setApplying(false);
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Upload Attachment (PDF, DOC):</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e => setAttachment(e.target.files[0])} />
              </div>
              <button type="submit" disabled={applying} style={{ padding: '0.5rem 1.5rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                {applying ? 'Applying...' : 'Apply'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Job