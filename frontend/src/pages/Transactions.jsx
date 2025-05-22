import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import EmptyState from '../components/EmptyState';
import SummaryCard from '../components/SummaryCard';
import FilterDrawer from '../components/FilterDrawer';
import { useTransactions } from '../contexts/TransactionContext';

const Transactions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { transactions, loading, error } = useTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    startDate: null,
    endDate: null,
    tags: [],
  });

  const categories = [...new Set(transactions.map(t => t.category))];
  const tags = [...new Set(transactions.flatMap(t => t.tags))];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filters.category || transaction.category === filters.category;
    const matchesDate = (!filters.startDate || new Date(transaction.date) >= filters.startDate) &&
                       (!filters.endDate || new Date(transaction.date) <= filters.endDate);
    const matchesTags = filters.tags.length === 0 || 
                       filters.tags.some(tag => transaction.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesDate && matchesTags;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleFilterChange = (key, value) => {
    if (key === 'tags') {
      setFilters(prev => ({
        ...prev,
        tags: prev.tags.includes(value)
          ? prev.tags.filter(tag => tag !== value)
          : [...prev.tags, value]
      }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      startDate: null,
      endDate: null,
      tags: [],
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              Transactions
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <TextField
                size="small"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setIsFilterOpen(true)}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsFormOpen(true)}
              >
                Add Transaction
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Total Income"
            value={totalIncome}
            icon={<TrendingUpIcon />}
            color="success"
            trend={totalIncome > 0 ? 'up' : 'neutral'}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Total Expenses"
            value={totalExpenses}
            icon={<TrendingDownIcon />}
            color="error"
            trend={totalExpenses > 0 ? 'down' : 'neutral'}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Balance"
            value={balance}
            icon={<AccountBalanceIcon />}
            color={balance >= 0 ? 'primary' : 'error'}
            trend={balance > 0 ? 'up' : balance < 0 ? 'down' : 'neutral'}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading transactions...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          title="No Transactions Found"
          description="Start tracking your finances by adding your first transaction."
          buttonText="Add Transaction"
          onButtonClick={() => setIsFormOpen(true)}
        />
      ) : (
        <TransactionList transactions={filteredTransactions} />
      )}

      <TransactionForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      <FilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={categories}
        tags={tags}
      />
    </Container>
  );
};

export default Transactions; 