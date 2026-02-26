import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Companies from './pages/Companies';
import Users from './pages/Users';
import Employees from './pages/Employees';
import Claims from './pages/Claims';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/users" element={<Users />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/claims" element={<Claims />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
