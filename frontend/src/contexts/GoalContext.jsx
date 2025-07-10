import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const GoalContext = createContext();

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/goals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Ensure we always set an array
      const goalsData = Array.isArray(response.data) ? response.data : [];
      setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError(error.response?.data?.message || 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData) => {
    try {
      const response = await axios.post('/api/goals', goalData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGoals(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  };

  const updateGoal = async (id, goalData) => {
    try {
      const response = await axios.patch(`/api/goals/${id}`, goalData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGoals(prev => 
        prev.map(g => g._id === id ? response.data : g)
      );
      return response.data;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`/api/goals/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setGoals(prev => prev.filter(g => g._id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  const getGoalProgress = async () => {
    try {
      const response = await axios.get('/api/goals/progress', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching goal progress:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const value = {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalProgress,
    refreshGoals: fetchGoals,
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
}; 