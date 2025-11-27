import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryListings from './pages/CategoryListings';
import ListingDetails from './pages/ListingDetails';
import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/category/:categoryId" element={<CategoryListings />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/edit-listing/:id" element={<CreateListing />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;