import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Navigation from "./components/layout/Navigation";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AdminLogin from "./components/auth/AdminLogin";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="pt-16">
            {" "}
            {/* Add padding top to account for fixed navbar */}
            <Routes>
              {/* Redirect root path to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute isAdmin>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
