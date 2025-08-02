import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/budgets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const budgetsData = Array.isArray(response.data) ? response.data : [];
      setBudgets(budgetsData);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budgetData) => {
    try {
      const response = await axios.post('/api/budgets', budgetData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBudgets(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateBudget = async (id, budgetData) => {
    try {
      const response = await axios.put(`/api/budgets/${id}`, budgetData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBudgets(prev => prev.map(b => b._id === id ? response.data : b));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`/api/budgets/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBudgets(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const value = {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshBudgets: fetchBudgets,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
}; 