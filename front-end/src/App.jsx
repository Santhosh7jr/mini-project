import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Services from "./pages/Services";
import FindWorkers from "./pages/FindWorkers";
import WorkerProfile from "./pages/WorkerProfile";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import LearnMore from "./pages/LearnMore";
import Favorites from "./pages/Favorites";
import AppLayout from "./components/AppLayout";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute role="user">
                <Bookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/worker"
            element={
              <ProtectedRoute role="worker">
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/services" element={<Services />} />
          <Route path="/find-workers" element={<FindWorkers />} />
          <Route path="/find-workers/:serviceId" element={<FindWorkers />} />
          <Route path="/worker/:id" element={<WorkerProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/learnmore" element={<LearnMore />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
