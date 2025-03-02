import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ children, isAuthenticated, isAdmin, user }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // For admin routes, check if user is admin
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(PrivateRoute);
