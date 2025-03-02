import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { login } from "../../redux/actions/authActions";

class AdminLogin extends Component {
  state = {
    email: "",
    password: "",
    error: null,
    attempts: 0,
    isLocked: false,
    lockoutTimer: null,
  };

  componentWillUnmount() {
    if (this.state.lockoutTimer) {
      clearTimeout(this.state.lockoutTimer);
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: null,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.state.isLocked) {
      this.setState({
        error: "Account is temporarily locked. Please try again later.",
      });
      return;
    }

    const { email, password } = this.state;

    try {
      const response = await this.props.login(email, password);

      if (response.user.role !== "admin") {
        this.setState((prevState) => {
          const newAttempts = prevState.attempts + 1;
          if (newAttempts >= 3) {
            this.lockAccount();
          }
          return {
            error: "Access denied. Admin privileges required.",
            attempts: newAttempts,
          };
        });
        return;
      }

      // Reset attempts on successful admin login
      this.setState({ attempts: 0 });
    } catch (err) {
      this.setState((prevState) => {
        const newAttempts = prevState.attempts + 1;
        if (newAttempts >= 3) {
          this.lockAccount();
        }
        return {
          error: err.response?.data?.error || "Invalid credentials",
          attempts: newAttempts,
        };
      });
    }
  };

  lockAccount = () => {
    const lockoutDuration = 5 * 60 * 1000; // 5 minutes
    this.setState({
      isLocked: true,
      error: "Account locked for 5 minutes due to multiple failed attempts.",
      lockoutTimer: setTimeout(() => {
        this.setState({
          isLocked: false,
          attempts: 0,
          error: null,
          lockoutTimer: null,
        });
      }, lockoutDuration),
    });
  };

  render() {
    const { isAuthenticated, user } = this.props;

    if (isAuthenticated && user?.role === "admin") {
      return <Navigate to="/admin" />;
    }

    if (isAuthenticated) {
      return <Navigate to="/dashboard" />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Secure access for administrators only
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={this.handleSubmit}>
            {this.state.error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{this.state.error}</span>
                {this.state.attempts > 0 && !this.state.isLocked && (
                  <p className="text-sm mt-1">
                    Attempts remaining: {3 - this.state.attempts}
                  </p>
                )}
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Admin Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  disabled={this.state.isLocked}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  disabled={this.state.isLocked}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  this.state.isLocked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                }`}
                disabled={this.state.isLocked}
              >
                Sign in to Admin Panel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { login })(AdminLogin);
