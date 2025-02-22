// Save token and user ID in localStorage
export const setAuthToken = (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", userId);
  };
  
  // Get stored token
  export const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  
  // Get logged-in user ID
  export const getUserId = () => {
    return localStorage.getItem("user_id");
  };
  
  // Remove token on logout
//   export const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user_id");
//   };
  