function checkLoggedInStatus () {
  let isLoggedIn;

  if (
    document.cookie.includes("access_token") 
    && localStorage.getItem('userId')
  ) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  return isLoggedIn;
}

export default checkLoggedInStatus;