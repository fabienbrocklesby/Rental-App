function logout() {
  document.cookie = "access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  window.localStorage.removeItem("userId");
  window.localStorage.removeItem("email");
  window.localStorage.removeItem("temp_email");
  window.location.href = "/";
}

export default logout;