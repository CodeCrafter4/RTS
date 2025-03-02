import {
  FETCH_TICKETS_REQUEST,
  FETCH_TICKETS_SUCCESS,
  FETCH_TICKETS_FAILURE,
  UPDATE_TICKET_STATUS,
  DELETE_TICKET,
  SET_TICKET_FILTER,
  SET_TICKET_SEARCH,
} from "../actions/types";

const initialState = {
  tickets: [],
  loading: false,
  error: null,
  filter: "",
  searchTerm: "",
};

const ticketReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TICKETS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_TICKETS_SUCCESS:
      return {
        ...state,
        loading: false,
        tickets: action.payload,
        error: null,
      };

    case FETCH_TICKETS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_TICKET_STATUS:
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket._id === action.payload.ticketId
            ? { ...ticket, status: action.payload.status }
            : ticket
        ),
      };

    case DELETE_TICKET:
      return {
        ...state,
        tickets: state.tickets.filter(
          (ticket) => ticket._id !== action.payload
        ),
      };

    case SET_TICKET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    case SET_TICKET_SEARCH:
      return {
        ...state,
        searchTerm: action.payload,
      };

    default:
      return state;
  }
};

export default ticketReducer;
