import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import axios from 'axios';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
      bgcolor: color,
      color: 'white',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography component="h2" variant="h6" gutterBottom>
        {title}
      </Typography>
      {icon}
    </Box>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
  </Paper>
);

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        My Financial Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Income"
            value={`$${data?.totalIncome?.toLocaleString() || 0}`}
            icon={<TrendingUpIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Expenses"
            value={`$${data?.totalExpenses?.toLocaleString() || 0}`}
            icon={<TrendingDownIcon />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Net Balance"
            value={`$${(data?.totalIncome - data?.totalExpenses)?.toLocaleString() || 0}`}
            icon={<AccountBalanceIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Goals"
            value={data?.goals?.length || 0}
            icon={<FlagIcon />}
            color="#ed6c02"
          />
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <List>
              {data?.recentTransactions?.map((transaction, index) => (
                <React.Fragment key={transaction._id}>
                  <ListItem>
                    <ListItemText
                      primary={transaction.description}
                      secondary={`${transaction.type === 'income' ? '+' : '-'}$${transaction.amount} - ${new Date(transaction.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < data.recentTransactions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Budget Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Budget Status
            </Typography>
            <List>
              {data?.budgets?.map((budget, index) => (
                <React.Fragment key={budget._id}>
                  <ListItem>
                    <ListItemText
                      primary={budget.category}
                      secondary={`$${budget.spent} / $${budget.amount} (${((budget.spent / budget.amount) * 100).toFixed(1)}%)`}
                    />
                  </ListItem>
                  {index < data.budgets.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard; 