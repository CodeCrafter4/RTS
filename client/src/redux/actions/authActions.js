import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGOUT,
} from "../types";

const API_URL = "https://rtsbackend.vercel.app/api";

export const login = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.error || "Login failed",
    });
    throw err;
  }
};

export const signup = (userData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/auth/signup`, userData);

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data,
    });

    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL,
      payload: err.response?.data?.error || "Signup failed",
    });
    throw err;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT });
};
