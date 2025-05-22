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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import TransactionForm from './TransactionForm';

const TransactionList = ({ transactions }) => {
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

  return (
    <>
      <AnimatePresence>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          {transactions.map((transaction) => (
            <motion.div key={transaction._id} variants={item}>
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: transaction.type === 'income' ? 'success.light' : 'error.light',
                      color: transaction.type === 'income' ? 'success.dark' : 'error.dark',
                    }}
                  >
                    {transaction.type === 'income' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {transaction.description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Chip
                        label={transaction.category}
                        size="small"
                        sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}
                      />
                      {transaction.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="h6"
                      color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(transaction)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(transaction)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <TransactionForm
        open={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
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
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TransactionList; 