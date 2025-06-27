import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/login";
import ManageHostel from "./components/owner/ManageHostel";
import MyHostel from "./components/owner/MyHostel";
import AllHostel from "./components/common/AllHostel";
import { useEffect, useState } from "react";
import Profile from "./components/common/Profile";
import HostelDetails from "./components/common/HostelDetails";
import Favorites from "./components/user/Favorites";
import Home from "./components/common/Home";
import Dashboard from "./components/common/Dashboard";
import './components/common/css/phone.css'

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme);
  }, []);
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
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/hostel/all`);
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
        console.log(process.env.REACT_APP_BACKEND_URL)
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getUser`, {
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
    <BrowserRouter basename="/">
      <Routes>

        {/* Owner Routes */}
        <Route
          path="/owner"
          element={
            token && role === "owner" ? (
              <Dashboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            ) : loading ? (
              <div>Loading...</div>
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element = {<Home hostels = {hostels}/>}/>
          <Route path="allhostels" element={<AllHostel hostels={filteredHostels} user={user} />} />
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
              <Dashboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            ) : loading ? (
              <div>Loading...</div>
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element = {<Home hostels={hostels}/>}/>

          <Route path = "allhostels" element={<AllHostel hostels={filteredHostels} user={user} />} />
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
              <Dashboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            )
          }
        >
          <Route index element = {<Home hostels={hostels}/>}/>

          <Route path = "allhostels" element={<AllHostel hostels={filteredHostels} />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Catch all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
