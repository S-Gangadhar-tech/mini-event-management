import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewEvent from "./pages/NewEvent.jsx";
import AllEvents from "./pages/AllEvents.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import EditEvent from "./pages/EditEvent.jsx";
import UpcomingEvents from "./pages/UpcomingEvents.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* All Event Actions are behind this ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/create" element={<NewEvent />} />
          <Route path="dashboard/events" element={<AllEvents />} />
          <Route path="dashboard/my-events" element={<MyEvents />} />
          <Route path="dashboard/edit/:id" element={<EditEvent />} />
          <Route path="dashboard/upcoming" element={<UpcomingEvents />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;