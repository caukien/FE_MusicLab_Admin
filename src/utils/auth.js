import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "jwt_token";

// Lưu token vào cookie
export const setToken = (token) => {
  const decoded = jwtDecode(token);
  const expires = new Date(decoded.exp * 1000);
  Cookies.set(TOKEN_KEY, token, { expires });
};

// Lấy token từ cookie
export const getToken = () => Cookies.get(TOKEN_KEY);

// Xóa token khỏi cookie
export const removeToken = () => Cookies.remove(TOKEN_KEY);

// Decode token để lấy userId
export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const decoded = jwtDecode(token);

  return decoded.UserId;
};

// Kiểm tra xem token có hết hạn không
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const hasAccess = (requiredRoles) => {
  const token = getToken();
  if (!token) return false;

  const decoded = jwtDecode(token);
  const userRole =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return requiredRoles.includes(userRole);
};
