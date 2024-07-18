import './App.css';
import Login from './pages/login';
import Dashboard from './components/dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    /* eslint-disable */ //FN 23-11-27
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
