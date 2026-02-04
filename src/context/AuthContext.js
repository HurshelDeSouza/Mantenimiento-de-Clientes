import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [rememberedUser, setRememberedUser] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const remembered = localStorage.getItem('rememberedUser');

    if (remembered) {
      setRememberedUser(remembered);
    }

    if (storedToken && storedUser) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: storedToken,
          user: JSON.parse(storedUser),
        },
      });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (username, password, remember) => {
    const response = await api.post('/api/Authenticate/login', {
      username,
      password,
    });

    const { token, userid, username: userName } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ userid, username: userName }));

    if (remember) {
      localStorage.setItem('rememberedUser', username);
      setRememberedUser(username);
    } else {
      localStorage.removeItem('rememberedUser');
      setRememberedUser('');
    }

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        token,
        user: { userid, username: userName },
      },
    });

    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await api.post('/api/Authenticate/register', {
      username,
      email,
      password,
    });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        rememberedUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
