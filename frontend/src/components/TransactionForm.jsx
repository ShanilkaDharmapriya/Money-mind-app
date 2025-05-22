import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Autocomplete,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { useTransactions } from '../contexts/TransactionContext';

const categories = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
];

const recurrenceOptions = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const TransactionForm = ({ open, onClose, transaction = null }) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    type: transaction?.type || 'expense',
    amount: transaction?.amount || '',
    category: transaction?.category || '',
    description: transaction?.description || '',
    date: transaction?.date ? new Date(transaction.date) : new Date(),
    tags: transaction?.tags || [],
    recurrence: transaction?.recurrence || 'none',
    endDate: transaction?.endDate ? new Date(transaction.endDate) : null,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const transactionData = {
        ...formData,
        date: formData.date.toISOString(),
        endDate: formData.endDate?.toISOString(),
      };

      if (transaction) {
        await updateTransaction(transaction._id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      setSuccess(true);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save transaction');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperComponent={motion.div}
        PaperProps={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 },
        }}
      >
        <DialogTitle>
          {transaction ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    label="Type"
                  >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={formData.date}
                    onChange={(date) => handleChange('date', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={formData.tags}
                  onChange={(event, newValue) => handleChange('tags', newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        size="small"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Add tags (press enter)"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Recurrence</InputLabel>
                  <Select
                    value={formData.recurrence}
                    onChange={(e) => handleChange('recurrence', e.target.value)}
                    label="Recurrence"
                  >
                    {recurrenceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {formData.recurrence !== 'none' && (
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date (Optional)"
                      value={formData.endDate}
                      onChange={(date) => handleChange('endDate', date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {transaction ? 'Update' : 'Add'} Transaction
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

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Transaction {transaction ? 'updated' : 'added'} successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default TransactionForm; 