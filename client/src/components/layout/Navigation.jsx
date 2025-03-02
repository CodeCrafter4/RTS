import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../redux/actions/authActions";

class Navigation extends Component {
  state = {
    isMobileMenuOpen: false,
    isProfileDropdownOpen: false,
  };

  toggleMobileMenu = () => {
    this.setState((prevState) => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }));
  };

  toggleProfileDropdown = () => {
    this.setState((prevState) => ({
      isProfileDropdownOpen: !prevState.isProfileDropdownOpen,
    }));
  };

  handleLogout = () => {
    this.props.logout();
    this.setState({ isMobileMenuOpen: false, isProfileDropdownOpen: false });
  };

  renderAuthButtons = () => {
    const { pathname } = this.props.location;

    // Show only admin button on login or signup pages
    if (pathname === "/login" || pathname === "/signup") {
      return (
        <Link
          to="/admin/login"
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Admin
        </Link>
      );
    }

    // Show login and signup buttons on admin login page
    if (pathname === "/admin/login") {
      return (
        <>
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 transform hover:-translate-y-0.5"
          >
            Sign Up
          </Link>
        </>
      );
    }

    // Default: show all buttons
    return (
      <>
        <Link
          to="/login"
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 transform hover:-translate-y-0.5"
        >
          Sign Up
        </Link>
        <Link
          to="/admin/login"
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Admin
        </Link>
      </>
    );
  };

  renderMobileAuthButtons = () => {
    const { pathname } = this.props.location;

    // Show only admin button on login or signup pages
    if (pathname === "/login" || pathname === "/signup") {
      return (
        <Link
          to="/admin/login"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          onClick={() => this.setState({ isMobileMenuOpen: false })}
        >
          Admin
        </Link>
      );
    }

    // Show login and signup buttons on admin login page
    if (pathname === "/admin/login") {
      return (
        <>
          <Link
            to="/login"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => this.setState({ isMobileMenuOpen: false })}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => this.setState({ isMobileMenuOpen: false })}
          >
            Sign Up
          </Link>
        </>
      );
    }

    // Default: show all buttons
    return (
      <>
        <Link
          to="/login"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          onClick={() => this.setState({ isMobileMenuOpen: false })}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          onClick={() => this.setState({ isMobileMenuOpen: false })}
        >
          Sign Up
        </Link>
        <Link
          to="/admin/login"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          onClick={() => this.setState({ isMobileMenuOpen: false })}
        >
          Admin
        </Link>
      </>
    );
  };

  render() {
    const { isAuthenticated, user } = this.props;
    const { isMobileMenuOpen, isProfileDropdownOpen } = this.state;

    if (!isAuthenticated) {
      return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/signup" className="flex items-center group">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center transform transition-transform duration-200 group-hover:scale-105 group-hover:bg-blue-700">
                      <span className="text-white font-bold text-xl">R</span>
                    </div>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    RTS
                  </span>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
                {this.renderAuthButtons()}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={this.toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMobileMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              {this.renderMobileAuthButtons()}
            </div>
          </div>
        </nav>
      );
    }

    return (
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">R</span>
                  </div>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  RTS
                </span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>

            {/* Desktop Profile Menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <div className="relative">
                <button
                  onClick={this.toggleProfileDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <span>Welcome, {user?.username}</span>
                  <svg
                    className={`h-5 w-5 transform transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={this.handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={this.toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => this.setState({ isMobileMenuOpen: false })}
            >
              Dashboard
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => this.setState({ isMobileMenuOpen: false })}
              >
                Admin Panel
              </Link>
            )}
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => this.setState({ isMobileMenuOpen: false })}
            >
              Your Profile
            </Link>
            <Link
              to="/settings"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => this.setState({ isMobileMenuOpen: false })}
            >
              Settings
            </Link>
            <button
              onClick={() => {
                this.handleLogout();
                this.setState({ isMobileMenuOpen: false });
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:text-red-800 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

// Create a wrapper component to provide location
const NavigationWrapper = (props) => {
  const location = useLocation();
  return <Navigation {...props} location={location} />;
};

export default connect(mapStateToProps, { logout })(NavigationWrapper);
