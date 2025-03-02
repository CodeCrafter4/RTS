import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

export const withAuth = (allowedRoles) => (WrappedComponent) => {
  class WithAuth extends Component {
    render() {
      const { isAuthenticated, user, loading } = this.props;

      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            Loading...
          </div>
        );
      }

      if (!isAuthenticated) {
        return <Navigate to="/login" />;
      }

      if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    loading: state.auth.loading,
  });

  return connect(mapStateToProps)(WithAuth);
};

export default withAuth;
