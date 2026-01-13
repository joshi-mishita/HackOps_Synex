// src/utils/auth.js

const AUTH_KEY = "synex_auth";
const USER_KEY = "synex_user";
const ACCOUNTS_KEY = "synex_accounts"; 
// stores array: [{ name, password }]

//Session
export function isLoggedIn() {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function login() {
  localStorage.setItem(AUTH_KEY, "true");
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

//Accounts
export function getAccounts() {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function hasAccounts() {
  return getAccounts().length > 0;
}

export function createAccount(name, password) {
  const accounts = getAccounts();

  // prevent duplicate names
  const exists = accounts.some(
    (a) => a.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    return { ok: false, msg: "User already exists. Please login." };
  }

  accounts.push({ name, password });
  saveAccounts(accounts);

  // set current user
  localStorage.setItem(USER_KEY, name);

  return { ok: true };
}

export function findAccount(name) {
  const accounts = getAccounts();
  return accounts.find((a) => a.name === name) || null;
}
