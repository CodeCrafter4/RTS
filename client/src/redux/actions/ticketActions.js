import axios from "axios";
import {
  GET_TICKETS,
  GET_TICKET,
  CREATE_TICKET,
  UPDATE_TICKET,
  TICKET_ERROR,
} from "../types";

const API_URL = "https://rtsbackend.vercel.app/api";

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

export const updateTicketStatus =
  (id, status) => async (dispatch, getState) => {
    try {
      const { user } = getState().auth;
      if (user.role !== "admin") {
        throw new Error("Only admins can update ticket status");
      }

      const res = await axios.put(
        `${API_URL}/tickets/${id}`,
        { status },
        getConfig()
      );

      dispatch({
        type: UPDATE_TICKET,
        payload: res.data,
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: TICKET_ERROR,
        payload:
          err.response?.data?.error || err.message || "Error updating ticket",
      });
      throw err;
    }
  };
