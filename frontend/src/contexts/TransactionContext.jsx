import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Ensure we always set an array
      const transactionsData = Array.isArray(response.data) ? response.data : [];
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const response = await axios.post('/api/transactions', transactionData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      const response = await axios.patch(`/api/transactions/${id}`, transactionData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(prev => 
        prev.map(t => t._id === id ? response.data : t)
      );
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const value = {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}; 