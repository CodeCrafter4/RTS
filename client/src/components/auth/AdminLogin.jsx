import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { login } from "../../redux/actions/authActions";

class AdminLogin extends Component {
  state = {
    email: "",
    password: "",
    error: null,
    loading: false,
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
      this.setState({ loading: true, error: null });
      const response = await this.props.login(email, password);

      if (!response || !response.user) {
        throw new Error("Invalid response from server");
      }

      if (response.user.role !== "admin") {
        this.setState((prevState) => {
          const newAttempts = prevState.attempts + 1;
          if (newAttempts >= 3) {
            this.lockAccount();
          }
          return {
            error: "Access denied. Admin privileges required.",
            attempts: newAttempts,
            loading: false,
          };
        });
        return;
      }

      // Reset attempts on successful admin login
      this.setState({ attempts: 0, loading: false });
    } catch (err) {
      console.error("Login error:", err);
      this.setState((prevState) => {
        const newAttempts = prevState.attempts + 1;
        if (newAttempts >= 3) {
          this.lockAccount();
        }
        return {
          error:
            err.response?.data?.msg ||
            err.response?.data?.error ||
            "Invalid credentials",
          attempts: newAttempts,
          loading: false,
        };
      });
    }
  };

  lockAccount = () => {
    const lockoutDuration = 5 * 60 * 1000; // 5 minutes
    this.setState({
      isLocked: true,
      error: "Account locked for 5 minutes due to multiple failed attempts.",
      loading: false,
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
    const { loading, error, attempts, isLocked } = this.state;

    if (isAuthenticated && user?.role === "admin") {
      return <Navigate to="/admin" />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-8">
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
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
                    <p className="text-sm text-red-700">{error}</p>
                    {attempts > 0 && !isLocked && (
                      <p className="mt-1 text-sm text-red-600">
                        Attempts remaining: {3 - attempts}
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
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="admin@example.com"
                    value={this.state.email}
                    onChange={this.handleChange}
                    disabled={isLocked || loading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    value={this.state.password}
                    onChange={this.handleChange}
                    disabled={isLocked || loading}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLocked || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
                disabled={isLocked || loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {isLocked
                  ? "Account Locked"
                  : loading
                  ? "Signing in..."
                  : "Sign in"}
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
