import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getTickets,
  updateTicketStatus,
  deleteTicket,
  exportTickets,
  setTicketFilter,
  setTicketSearch,
} from "../../redux/actions/ticketActions";

const AdminDashboard = ({
  user,
  tickets,
  loading,
  filter,
  searchTerm,
  getTickets,
  updateTicketStatus,
  deleteTicket,
  exportTickets,
  setTicketFilter,
  setTicketSearch,
}) => {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getTickets();
  }, [getTickets]);

  const handleStatusChange = (ticketId, newStatus) => {
    updateTicketStatus(ticketId, newStatus);
  };

  const handleDelete = (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      deleteTicket(ticketId);
    }
  };

  const handleExport = () => {
    exportTickets();
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setTicketSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setTicketFilter(e.target.value);
  };

  // Filter and search tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = !filter || ticket.status === filter;
    const matchesSearch =
      !searchTerm ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    responseTime: "2.4h", // This should come from backend calculation
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.username || "Admin"}! Here's your system
              overview.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Export Tickets
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Tickets */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Total Tickets
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
              <p className="text-xs text-green-600">All tickets in system</p>
            </div>
          </div>
        </div>

        {/* Open Tickets */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Open Tickets
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.open}
              </p>
              <p className="text-xs text-yellow-600">Needs attention</p>
            </div>
          </div>
        </div>

        {/* Resolved Tickets */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Resolved</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.resolved}
              </p>
              <p className="text-xs text-green-600">
                {((stats.resolved / stats.total) * 100).toFixed(0)}% resolution
                rate
              </p>
            </div>
          </div>
        </div>

        {/* Average Response Time */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Response Time
              </h2>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.responseTime}
              </p>
              <p className="text-xs text-purple-600">Average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
          <div className="flex items-center space-x-4">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchInput}
              onChange={handleSearch}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{ticket._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ticket.subject}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ticket.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-sm">
                          {ticket.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="text-sm rounded-full px-3 py-1 font-semibold"
                      style={{
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                        color: "rgb(245, 158, 11)",
                      }}
                      value={ticket.status}
                      onChange={(e) =>
                        handleStatusChange(ticket._id, e.target.value)
                      }
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : ticket.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => {
                        // TODO: Implement view functionality
                        console.log("View ticket:", ticket._id);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(ticket._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredTickets.length}</span> of{" "}
            <span className="font-medium">{tickets.length}</span> tickets
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  tickets: state.tickets.tickets,
  loading: state.tickets.loading,
  filter: state.tickets.filter,
  searchTerm: state.tickets.searchTerm,
});

export default connect(mapStateToProps, {
  getTickets,
  updateTicketStatus,
  deleteTicket,
  exportTickets,
  setTicketFilter,
  setTicketSearch,
})(AdminDashboard);
