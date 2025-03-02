import React, { Component } from "react";
import { connect } from "react-redux";
import { getTickets, createTicket } from "../../redux/actions/ticketActions";

class UserDashboard extends Component {
  state = {
    title: "",
    description: "",
    error: null,
    showForm: false,
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

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: null,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description } = this.state;

    try {
      await this.props.createTicket({ title, description });
      this.setState({
        title: "",
        description: "",
        showForm: false,
        error: null,
      });
    } catch (err) {
      this.setState({
        error: err.response?.data?.error || "Failed to create ticket",
      });
    }
  };

  toggleForm = () => {
    this.setState((prevState) => ({
      showForm: !prevState.showForm,
      error: null,
    }));
  };

  render() {
    const { tickets, loading, error: reduxError, user } = this.props;
    const error = this.state.error || reduxError;

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      );
    }

    // Check if user exists and has the correct role
    if (!user || user.role !== "user") {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-red-600">
              Access denied. You must be logged in as a regular user to view
              this page.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <button
            onClick={this.toggleForm}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {this.state.showForm ? "Close Form" : "Create New Ticket"}
          </button>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {this.state.showForm && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <form onSubmit={this.handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  name="title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  name="description"
                  value={this.state.description}
                  onChange={this.handleChange}
                  rows="4"
                  required
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No tickets found. Create a new ticket to get started.
            </p>
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ticket.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets.tickets,
  loading: state.tickets.loading,
  error: state.tickets.error,
  user: state.auth.user,
});

export default connect(mapStateToProps, { getTickets, createTicket })(
  UserDashboard
);
