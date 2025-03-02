import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getTickets,
  updateTicketStatus,
} from "../../redux/actions/ticketActions";

class AdminDashboard extends Component {
  state = {
    error: null,
    updatingTicketId: null,
  };

  componentDidMount() {
    this.fetchTickets();
  }

  fetchTickets = async () => {
    try {
      await this.props.getTickets();
      this.setState({ error: null });
    } catch (err) {
      this.setState({
        error: err.response?.data?.error || "Failed to fetch tickets",
      });
    }
  };

  handleStatusChange = async (ticketId, newStatus) => {
    this.setState({ updatingTicketId: ticketId });
    try {
      await this.props.updateTicketStatus(ticketId, newStatus);
      this.setState({ error: null, updatingTicketId: null });
      await this.fetchTickets();
    } catch (err) {
      this.setState({
        error: err.response?.data?.error || "Failed to update ticket status",
        updatingTicketId: null,
      });
    }
  };

  renderTicketRow = (ticket) => {
    if (!ticket) return null;

    const createdBy = ticket.createdBy || {};
    const status = (ticket.status || "").toLowerCase();
    const statusColors = {
      open: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      closed: "bg-gray-100 text-gray-800",
    };

    return (
      <tr key={ticket._id || "temp-id"}>
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">
            {ticket.title || "Untitled Ticket"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">
            {createdBy.username || "Unknown User"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusColors[status] || statusColors.closed
            }`}
          >
            {ticket.status || "Unknown"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {ticket.createdAt
            ? new Date(ticket.createdAt).toLocaleString()
            : "Unknown date"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={ticket.status || "open"}
            onChange={(e) =>
              this.handleStatusChange(ticket._id, e.target.value)
            }
            disabled={this.state.updatingTicketId === ticket._id}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          {this.state.updatingTicketId === ticket._id && (
            <div className="mt-2 text-xs text-gray-500">Updating...</div>
          )}
        </td>
      </tr>
    );
  };

  render() {
    const { tickets = [], loading, error: reduxError } = this.props;
    const error = this.state.error || reduxError;

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Tickets</h1>
          <p className="mt-2 text-sm text-gray-600">
            Total Tickets: {tickets.length || 0}
          </p>
          <button
            onClick={this.fetchTickets}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Refresh Tickets
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!tickets || tickets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No tickets found in the system.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => this.renderTicketRow(ticket))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets.tickets || [],
  loading: state.tickets.loading,
  error: state.tickets.error,
});

export default connect(mapStateToProps, { getTickets, updateTicketStatus })(
  AdminDashboard
);
