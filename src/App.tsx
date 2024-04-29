import './App.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const isAllowed = localStorage.getItem('token')
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route element={<PrivateRoute isAllowed={!!isAllowed as boolean} />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
