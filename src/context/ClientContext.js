import React, { createContext, useContext, useReducer } from 'react';
import api from '../services/api';

const ClientContext = createContext();

const initialState = {
  clients: [],
  currentClient: null,
  interests: [],
  loading: false,
  error: null,
};

const clientReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload, loading: false };
    case 'SET_CURRENT_CLIENT':
      return { ...state, currentClient: action.payload, loading: false };
    case 'SET_INTERESTS':
      return { ...state, interests: action.payload };
    case 'CLEAR_CURRENT_CLIENT':
      return { ...state, currentClient: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'REMOVE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter((c) => c.id !== action.payload),
      };
    default:
      return state;
  }
};

export const ClientProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clientReducer, initialState);

  const searchClients = async (filters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await api.post('/api/Cliente/Listado', filters);
    dispatch({ type: 'SET_CLIENTS', payload: response.data });
    return response.data;
  };

  const getClient = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await api.get(`/api/Cliente/Obtener/${id}`);
    dispatch({ type: 'SET_CURRENT_CLIENT', payload: response.data });
    return response.data;
  };

  const createClient = async (clientData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await api.post('/api/Cliente/Crear', clientData);
    dispatch({ type: 'SET_LOADING', payload: false });
    return response.data;
  };

  const updateClient = async (clientData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await api.post('/api/Cliente/Actualizar', clientData);
    dispatch({ type: 'SET_LOADING', payload: false });
    return response.data;
  };

  const deleteClient = async (id) => {
    // Nota: El endpoint DELETE está desactivado según las instrucciones
    // Se programa pero no se consume
    dispatch({ type: 'REMOVE_CLIENT', payload: id });
    // await api.delete(`/api/Cliente/Eliminar/${id}`);
  };

  const getInterests = async () => {
    const response = await api.get('/api/Intereses/Listado');
    dispatch({ type: 'SET_INTERESTS', payload: response.data });
    return response.data;
  };

  const clearCurrentClient = () => {
    dispatch({ type: 'CLEAR_CURRENT_CLIENT' });
  };

  return (
    <ClientContext.Provider
      value={{
        ...state,
        searchClients,
        getClient,
        createClient,
        updateClient,
        deleteClient,
        getInterests,
        clearCurrentClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient debe usarse dentro de ClientProvider');
  }
  return context;
};
