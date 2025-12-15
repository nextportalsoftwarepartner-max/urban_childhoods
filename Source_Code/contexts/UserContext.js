import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'guest' or 'member'
  const [userGender, setUserGender] = useState(null); // 'male' or 'female'

  const setGuestUser = () => {
    setUserType('guest');
    setUserGender(null);
  };

  const setMemberUser = (gender = null) => {
    setUserType('member');
    setUserGender(gender);
  };

  const clearUser = () => {
    setUserType(null);
    setUserGender(null);
  };

  const value = {
    userType,
    userGender,
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

