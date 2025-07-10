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
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import EmptyState from '../components/EmptyState';
import SummaryCard from '../components/SummaryCard';
import FilterDrawer from '../components/FilterDrawer';
import { useTransactions } from '../contexts/TransactionContext';

const Transactions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { transactions, loading, error, refreshTransactions } = useTransactions();
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

  // Calculate statistics
  const totalTransactions = filteredTransactions.length;
  const incomeTransactions = filteredTransactions.filter(t => t.type === 'income').length;
  const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense').length;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}08 0%, ${theme.palette.secondary.light}08 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <MoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Transactions
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage your financial records with ease
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  flexWrap: 'wrap'
                }}>
                  <TextField
                    size="small"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: 250,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                        boxShadow: theme.shadows[1],
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setIsFilterOpen(true)}
                    sx={{ 
                      borderRadius: 3,
                      px: 3,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: theme.palette.primary.light + '10',
                      }
                    }}
                  >
                    Filters
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsFormOpen(true)}
                    sx={{ 
                      borderRadius: 3,
                      px: 3,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: theme.shadows[3],
                      '&:hover': {
                        boxShadow: theme.shadows[6],
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Add Transaction
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <SummaryCard
                  title="Total Income"
                  value={totalIncome}
                  icon={<TrendingUpIcon />}
                  color="success"
                  trend={totalIncome > 0 ? 'up' : 'neutral'}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <SummaryCard
                  title="Total Expenses"
                  value={totalExpenses}
                  icon={<TrendingDownIcon />}
                  color="error"
                  trend={totalExpenses > 0 ? 'down' : 'neutral'}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <SummaryCard
                  title="Balance"
                  value={balance}
                  icon={<AccountBalanceIcon />}
                  color={balance >= 0 ? 'primary' : 'error'}
                  trend={balance > 0 ? 'up' : balance < 0 ? 'down' : 'neutral'}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.info.light}15 0%, ${theme.palette.info.light}05 100%)`,
                    border: `1px solid ${theme.palette.info.light}30`,
                    borderRadius: 4,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: theme.palette.info.light + '20',
                          color: theme.palette.info.main,
                          mr: 2,
                        }}
                      >
                        <CategoryIcon />
                      </Avatar>
                      <Typography variant="h6" color="text.secondary">
                        Total Transactions
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {totalTransactions}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={`${incomeTransactions} Income`} 
                        size="small" 
                        color="success" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`${expenseTransactions} Expenses`} 
                        size="small" 
                        color="error" 
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
              borderRadius: 4,
              boxShadow: theme.shadows[2],
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing {filteredTransactions.length} of {transactions.length} transactions
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={refreshTransactions}
                    variant="text"
                    sx={{ 
                      borderRadius: 2,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light + '10',
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <Fade in={loading}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
              <LinearProgress sx={{ width: '100%', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Loading transactions...
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Error State */}
        {error && (
          <Slide direction="up" in={!!error}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Paper
                sx={{
                  p: 3,
                  maxWidth: 400,
                  textAlign: 'center',
                  border: `1px solid ${theme.palette.error.light}`,
                  backgroundColor: theme.palette.error.light + '10',
                }}
              >
                <Typography color="error" variant="h6" gutterBottom>
                  Error
                </Typography>
                <Typography color="error" variant="body1">
                  {error}
                </Typography>
              </Paper>
            </Box>
          </Slide>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {!loading && !error && filteredTransactions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <EmptyState
                title="No Transactions Found"
                message="Start tracking your finances by adding your first transaction."
                actionLabel="Add Transaction"
                onAction={() => setIsFormOpen(true)}
              />
            </motion.div>
          ) : !loading && !error ? (
            <motion.div
              key="transactions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TransactionList transactions={filteredTransactions} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Forms and Drawers */}
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
    </Box>
  );
};

export default Transactions; 