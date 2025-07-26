import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardActions,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import TransactionForm from './TransactionForm';

const TransactionList = ({ transactions, loading = false }) => {
  const theme = useTheme();
  const { deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [error, setError] = useState(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (transaction) => {
    setTransactionToDelete(transaction);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTransaction(transactionToDelete._id);
      setDeleteConfirmOpen(false);
      setTransactionToDelete(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Food & Dining': '#ff6b6b',
      'Transportation': '#4ecdc4',
      'Housing': '#45b7d1',
      'Utilities': '#96ceb4',
      'Entertainment': '#feca57',
      'Shopping': '#ff9ff3',
      'Healthcare': '#54a0ff',
      'Education': '#5f27cd',
      'Travel': '#00d2d3',
      'Other': '#c8d6e5',
    };
    return colorMap[category] || '#c8d6e5';
  };

  const getCategoryIcon = (category) => {
    // You can add more category-specific icons here
    return transaction.type === 'income' ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((index) => (
            <Card key={index} sx={{ mb: 2, borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={56} height={56} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="30%" height={20} />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Skeleton variant="text" width={80} height={32} />
                    <Skeleton variant="text" width={60} height={20} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <AnimatePresence>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {transactions.map((transaction) => (
            <motion.div key={transaction._id} variants={item}>
              <Card
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    borderColor: transaction.type === 'income' ? theme.palette.success.main : theme.palette.error.main,
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: transaction.type === 'income' 
                      ? `linear-gradient(180deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`
                      : `linear-gradient(180deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: getCategoryColor(transaction.category),
                          width: 56,
                          height: 56,
                          border: `2px solid ${getCategoryColor(transaction.category)}30`,
                        }}
                      >
                        {getCategoryIcon(transaction.category)}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 0.5,
                          }}
                        >
                          {transaction.description}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          <Chip
                            label={transaction.category}
                            size="small"
                            sx={{ 
                              bgcolor: getCategoryColor(transaction.category) + '20',
                              color: getCategoryColor(transaction.category),
                              fontWeight: 600,
                              borderRadius: 2,
                            }}
                          />
                          {transaction.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderRadius: 2,
                                borderColor: theme.palette.primary.light,
                                color: theme.palette.primary.main,
                              }}
                            />
                          ))}
                        </Stack>
                        
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            fontSize: '0.75rem',
                          }}
                        >
                          {format(new Date(transaction.date), 'MMM dd, yyyy • HH:mm')}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h5"
                          color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                          sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                          }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontWeight: 600,
                          }}
                        >
                          {transaction.type}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            sx={{ 
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.light + '20',
                              }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(transaction)}
                            sx={{ 
                              color: theme.palette.info.main,
                              '&:hover': {
                                backgroundColor: theme.palette.info.light + '20',
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(transaction)}
                            sx={{ 
                              color: theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: theme.palette.error.light + '20',
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      )}

      <TransactionForm
        open={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </Typography>
          {transactionToDelete && (
            <Paper
              sx={{
                p: 2,
                background: theme.palette.grey[50],
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Transaction Details:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {transactionToDelete.description} - ${transactionToDelete.amount}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TransactionList; 