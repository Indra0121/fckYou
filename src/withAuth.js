import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const withAuth = (Component, redirectTo = "/authentication/sign-in") => {
  return (props) => {
    const isAuthenticated = useSelector((state) => state.global.isAuthenticated);
    
    if (!isAuthenticated) {
      return <Navigate to={redirectTo} />;
    }
    
    return <Component {...props} />;
  };
};

export default withAuth;
