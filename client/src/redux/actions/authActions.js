import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGOUT,
} from "../types";

const API_URL =
  process.env.REACT_APP_API_URL || "https://rtsbackend.vercel.app/api";

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    console.log("Request data:", config.data);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.data);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response || error);
    return Promise.reject(error);
  }
);

export const login = (email, password) => async (dispatch) => {
  console.log("Login attempt with email:", email);
  console.log("API URL:", API_URL);

  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    console.log("Login response:", res.data);

    if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);

      // Store user role in localStorage for persistence
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      return res.data;
    } else {
      console.error("Invalid server response:", res.data);
      throw new Error("Invalid response from server");
    }
  } catch (err) {
    console.error("Login error:", err);
    console.error("Error response:", err.response?.data);

    dispatch({
      type: LOGIN_FAIL,
      payload:
        err.response?.data?.msg || err.response?.data?.error || "Login failed",
    });
    throw err;
  }
};

export const signup = (userData) => async (dispatch) => {
  try {
    console.log("Signup attempt with data:", userData);

    const res = await axios.post(`${API_URL}/auth/register`, userData);

    console.log("Signup response:", res.data);

    if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);

      // Store user role in localStorage for persistence
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      dispatch({
        type: SIGNUP_SUCCESS,
        payload: res.data,
      });

      return res.data;
    } else {
      console.error("Invalid server response:", res.data);
      throw new Error("Invalid response from server");
    }
  } catch (err) {
    console.error("Signup error:", err);
    console.error("Error response:", err.response?.data);

    dispatch({
      type: SIGNUP_FAIL,
      payload:
        err.response?.data?.msg || err.response?.data?.error || "Signup failed",
    });
    throw err;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({ type: LOGOUT });
};
