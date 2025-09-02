import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/register'
import PostJob from './pages/postjob'
import Login from './pages/login'
import Job from './pages/job'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/job" element={<Job />} />
        <Route path="/postjob" element={<PostJob />} />
      </Routes>
    </Router>
  )
}

export default App
