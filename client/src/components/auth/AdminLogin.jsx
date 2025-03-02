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
      <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-8 ">
          <div>
            <h2 className="mt-2 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
              Admin Portal
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Secure access for administrators only
              </span>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={this.handleSubmit}>
            {this.state.error && (
              <div
                className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md transition-all duration-300 animate-fade-in"
                role="alert"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{this.state.error}</p>
                    {this.state.attempts > 0 && !this.state.isLocked && (
                      <p className="mt-1 text-sm text-red-600">
                        Attempts remaining: {3 - this.state.attempts}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300
                    disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="admin@example.com"
                    value={this.state.email}
                    onChange={this.handleChange}
                    disabled={this.state.isLocked}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300
                    disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    value={this.state.password}
                    onChange={this.handleChange}
                    disabled={this.state.isLocked}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white 
                transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${
                  this.state.isLocked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-indigo-500 shadow-lg hover:shadow-xl"
                }`}
                disabled={this.state.isLocked}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {this.state.isLocked ? (
                    <svg
                      className="h-5 w-5 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  )}
                </span>
                {this.state.isLocked
                  ? "Account Locked"
                  : "Sign in to Admin Panel"}
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
