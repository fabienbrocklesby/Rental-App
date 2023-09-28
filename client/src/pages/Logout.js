function logout() {
  window.localStorage.removeItem("userId");
  window.localStorage.removeItem("email");
  window.localStorage.removeItem("temp_email");
  document.cookie = "access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  
  setTimeout(() => {
    window.location.href = "/";
  }, 100); 
}

export default logout;
