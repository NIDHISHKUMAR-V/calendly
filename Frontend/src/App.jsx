import { Routes, Route } from 'react-router-dom';
import UserBooking from './components/UserBooking';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserBooking />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
