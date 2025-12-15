import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'guest' or 'member'

  const setGuestUser = () => {
    setUserType('guest');
  };

  const setMemberUser = () => {
    setUserType('member');
  };

  const clearUser = () => {
    setUserType(null);
  };

  const value = {
    userType,
    setGuestUser,
    setMemberUser,
    clearUser,
    isGuest: userType === 'guest',
    isMember: userType === 'member',
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

