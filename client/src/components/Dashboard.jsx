import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createTicket, getTickets } from "../redux/actions/ticketActions";

const Dashboard = ({ user, createTicket, getTickets, tickets, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState({
    title: "",
    description: "",
    priority: "low",
    category: "general",
  });
  const [error, setError] = useState(null);

  // Fetch tickets when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTickets();
      } catch (err) {
        setError(err.message || "Failed to fetch tickets");
      }
    };
    fetchData();
  }, [getTickets]);

  const handleInputChange = (e) => {
    setTicketData({
      ...ticketData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(ticketData);
      setIsModalOpen(false);
      setTicketData({
        title: "",
        description: "",
        priority: "low",
        category: "general",
      });
      // Refresh tickets after creating a new one
      await getTickets();
    } catch (err) {
      setError(err.response?.data?.error || "Error creating ticket");
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-sm md:text-xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username || "User"}!
            </h1>
            <p className="hidden md:block text-gray-600">
              Here's what's happening with your tickets today.
            </p>
          </div>
          <button
            className="bg-blue-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            Create Ticket
          </button>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Ticket
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
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
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={ticketData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={ticketData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={ticketData.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={ticketData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Tickets
        </h2>
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets && tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ticket.category}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {ticket.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === "open"
                            ? "bg-green-100 text-green-800"
                            : ticket.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
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
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No tickets found. Create your first ticket!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  tickets: state.tickets.tickets,
  loading: state.tickets.loading,
});

export default connect(mapStateToProps, { createTicket, getTickets })(
  Dashboard
);
