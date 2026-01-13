// src/utils/auth.js

const AUTH_KEY = "synex_auth";

export function isLoggedIn() {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function login() {
  localStorage.setItem(AUTH_KEY, "true");
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
