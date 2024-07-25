import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { AuthContext } from "./../providers/authProvider";

const Protected = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" />;

  return children;
};

Protected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Protected;
