import React, { Component } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import store from "./redux/store";

import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import AdminLogin from "./components/auth/AdminLogin";
import Signup from "./components/auth/Signup";
import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import withAuth from "./components/auth/withAuth";

// Wrap dashboard components with role-based authentication
const ProtectedUserDashboard = withAuth(["user", "admin"])(UserDashboard);
const ProtectedAdminDashboard = withAuth(["admin"])(AdminDashboard);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={<ProtectedAdminDashboard />} />
                <Route
                  path="/dashboard"
                  element={
                    store.getState().auth.user?.role === "admin" ? (
                      <ProtectedAdminDashboard />
                    ) : (
                      <ProtectedUserDashboard />
                    )
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
