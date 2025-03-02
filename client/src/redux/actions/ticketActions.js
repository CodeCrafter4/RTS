import axios from "axios";
import {
  GET_TICKETS,
  GET_TICKET,
  CREATE_TICKET,
  UPDATE_TICKET,
  TICKET_ERROR,
  FETCH_TICKETS_REQUEST,
  FETCH_TICKETS_SUCCESS,
  FETCH_TICKETS_FAILURE,
  UPDATE_TICKET_STATUS,
  DELETE_TICKET,
  SET_TICKET_FILTER,
  SET_TICKET_SEARCH,
} from "../types";

// Change the API URL to point to the local development server
const API_URL = "http://localhost:5000/api";

// Setup axios config with token
const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Check user permissions
const checkPermission = (user, ticketUserId) => {
  if (!user) return false;
  return user.role === "admin" || user._id === ticketUserId;
};

export const getTickets = () => async (dispatch, getState) => {
  try {
    const res = await axios.get(`${API_URL}/tickets`, getConfig());

    dispatch({
      type: GET_TICKETS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: err.response?.data?.error || "Error fetching tickets",
    });
    throw err;
  }
};

export const getTicket = (id) => async (dispatch, getState) => {
  try {
    const res = await axios.get(`${API_URL}/tickets/${id}`, getConfig());
    const { user } = getState().auth;

    if (!checkPermission(user, res.data.createdBy._id)) {
      throw new Error("Not authorized to view this ticket");
    }

    dispatch({
      type: GET_TICKET,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload:
        err.response?.data?.error || err.message || "Error fetching ticket",
    });
    throw err;
  }
};

export const createTicket = (ticketData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/tickets`, ticketData, getConfig());

    dispatch({
      type: CREATE_TICKET,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: err.response?.data?.error || "Error creating ticket",
    });
    throw err;
  }
};

// Update ticket status
export const updateTicketStatus =
  (ticketId, status) => async (dispatch, getState) => {
    try {
      const { user } = getState().auth;
      if (user.role !== "admin") {
        throw new Error("Only admins can update ticket status");
      }

      const res = await axios.patch(
        `${API_URL}/tickets/${ticketId}/status`,
        { status },
        getConfig()
      );

      dispatch({
        type: UPDATE_TICKET_STATUS,
        payload: { ticketId, status: res.data.status },
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: TICKET_ERROR,
        payload:
          err.response?.data?.error ||
          err.message ||
          "Error updating ticket status",
      });
      throw err;
    }
  };

// Delete ticket
export const deleteTicket = (ticketId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/tickets/${ticketId}`, getConfig());

    dispatch({
      type: DELETE_TICKET,
      payload: ticketId,
    });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    dispatch({
      type: TICKET_ERROR,
      payload: err.response?.data?.error || "Error deleting ticket",
    });
  }
};

// Export tickets
export const exportTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/tickets/export`, {
      ...getConfig(),
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tickets.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Error exporting tickets:", err);
    throw err;
  }
};

// Set ticket filter
export const setTicketFilter = (status) => ({
  type: SET_TICKET_FILTER,
  payload: status,
});

// Set ticket search
export const setTicketSearch = (searchTerm) => ({
  type: SET_TICKET_SEARCH,
  payload: searchTerm,
});
