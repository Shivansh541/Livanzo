import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/login";
import OwnerDashboard from './components/owner/OwnerDashboard';
import UserDashboard from './components/user/UserDashboard';
import ManageHostel from "./components/owner/ManageHostel";
import MyHostel from "./components/owner/MyHostel";
import AllHostel from "./components/common/AllHostel";
import { useEffect, useState } from "react";
import Profile from "./components/common/Profile";
import HostelDetails from "./components/common/HostelDetails";
import Guest from "./components/guest/Guest";
import Favorites from "./components/user/Favorites";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Load token and role from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setToken(storedToken);
    setRole(storedRole);
    setLoading(false);
  }, []);

  // Fetch all hostels
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/hostel/all');
        if (!res.ok) throw new Error('Failed to fetch hostels');
        const data = await res.json();
        setHostels(data);
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    };
    fetchHostels();
  }, []);

  // Fetch logged-in user info
  useEffect(() => {
    const getUser = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/auth/getUser', {
          headers: {
            'auth-token': token,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUser();
  }, [token]);

  // Filter hostels based on search term
  const filteredHostels = hostels.filter((h) => {
    const hostelString = JSON.stringify(h).toLowerCase();
    return hostelString.includes(searchTerm.toLowerCase());
  });

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Owner Routes */}
        <Route
          path="/owner"
          element={
            token && role === "owner" ? (
              <OwnerDashboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            ) : loading ? (
              <div>Loading...</div>
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<AllHostel hostels={filteredHostels} user={user} />} />
          <Route path="hostel/:id" element={<HostelDetails user={user} />} />
          <Route path="myHostels" element={<MyHostel />} />
          <Route path="manageHostels" element={<ManageHostel />} />
          <Route path="profile" element={<Profile user={user} isOwner={true} />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            token && role === "renter" ? (
              <UserDashboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            ) : loading ? (
              <div>Loading...</div>
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<AllHostel hostels={filteredHostels} user={user} />} />
          <Route path="hostel/:id" element={<HostelDetails user={user} />} />
          <Route path = "favorites" element={<Favorites user={user} allhostels = {filteredHostels} />} />
          <Route path="profile" element={<Profile user={user} isOwner={false} />} />
        </Route>

        {/* Guest/Home Route */}
        <Route
          path="/"
          element={
            token ? (
              role === "owner" ? (
                <Navigate to="/owner" />
              ) : (
                <Navigate to="/user" />
              )
            ) : (
              <Guest searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            )
          }
        >
          <Route index element={<AllHostel hostels={filteredHostels} />} />
        </Route>

        {/* Catch all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
