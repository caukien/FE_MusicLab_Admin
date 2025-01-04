import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { hasAccess } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  if (!hasAccess(allowedRoles)) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
