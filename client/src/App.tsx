import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainBar from './components/navbar';
import Home from './pages/Homepage';
import Properties from './pages/Listings';
import SharedHomes from './pages/SharedHomes';
import Housemates from './pages/Housemates';
import Chats from './pages/Chats';
import Account from './pages/Dashboard';
import Register from './pages/SignUp';
import PropertyDetail from './pages/ListingDetailPage';
import SharedHomeDetail from './pages/SharedHomeDetailPage';
import HousemateDetail from './pages/HousemateDetailPage';

function App() {
  return (
    <BrowserRouter>
      <MainBar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Properties />} />
          <Route path="/listings/:id" element={<PropertyDetail />} />
          <Route path="/sharedhomes" element={<SharedHomes />} />
          <Route path="/sharedhomes/:id" element={<SharedHomeDetail />} />
          <Route path="/housemates" element={<Housemates />} />
          <Route path="/housemates/:id" element={<HousemateDetail />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/account" element={<Account />} />
          <Route path="/register" element={<Register />} />
          

        </Routes>
        </main>
        </BrowserRouter>
  );
}

export default App;

