import {
  GET_TICKETS,
  GET_TICKET,
  CREATE_TICKET,
  UPDATE_TICKET,
  TICKET_ERROR,
} from "../types";

const initialState = {
  tickets: [],
  currentTicket: null,
  error: null,
  loading: true,
};

export default function ticketReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TICKETS:
      return {
        ...state,
        tickets: payload,
        loading: false,
      };

    case GET_TICKET:
      return {
        ...state,
        currentTicket: payload,
        loading: false,
      };

    case CREATE_TICKET:
      return {
        ...state,
        tickets: [payload, ...state.tickets],
        loading: false,
      };

    case UPDATE_TICKET:
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket._id === payload._id ? payload : ticket
        ),
        loading: false,
      };

    case TICKET_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
}
