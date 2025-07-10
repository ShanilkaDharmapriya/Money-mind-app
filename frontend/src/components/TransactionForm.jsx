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
  Avatar,
  Divider,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  DateRange as DateIcon,
  LocalOffer as TagIcon,
} from '@mui/icons-material';
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
  const theme = useTheme();
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
        maxWidth="md"
        fullWidth
        PaperComponent={motion.div}
        PaperProps={{
          initial: { opacity: 0, y: 20, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 20, scale: 0.95 },
          transition: { duration: 0.3 },
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 48,
                height: 48,
              }}
            >
              {transaction ? <EditIcon /> : <AddIcon />}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {transaction ? 'Edit Transaction' : 'Add New Transaction'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {transaction ? 'Update your transaction details' : 'Track your income or expense'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Transaction Type */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      label="Transaction Type"
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.divider,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <MenuItem value="income">Income</MenuItem>
                      <MenuItem value="expense">Expense</MenuItem>
                    </Select>
                  </FormControl>
                </motion.div>
              </Grid>

              {/* Amount */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <MoneyIcon color="action" />
                        </Box>
                      ),
                    }}
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.divider,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  />
                </motion.div>
              </Grid>

              {/* Category */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      label="Category"
                      startAdornment={
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <CategoryIcon color="action" />
                        </Box>
                      }
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.divider,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </motion.div>
              </Grid>

              {/* Date */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date"
                      value={formData.date}
                      onChange={(date) => handleChange('date', date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                <DateIcon color="action" />
                              </Box>
                            ),
                          }}
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.divider,
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </motion.div>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <DescriptionIcon color="action" />
                        </Box>
                      ),
                    }}
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.divider,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  />
                </motion.div>
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
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
                          sx={{ borderRadius: 2 }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Add tags (press enter)"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                              <TagIcon color="action" />
                            </Box>
                          ),
                        }}
                        sx={{
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      />
                    )}
                  />
                </motion.div>
              </Grid>

              {/* Recurrence */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Recurrence</InputLabel>
                    <Select
                      value={formData.recurrence}
                      onChange={(e) => handleChange('recurrence', e.target.value)}
                      label="Recurrence"
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.divider,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      {recurrenceOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </motion.div>
              </Grid>

              {/* End Date for Recurrence */}
              {formData.recurrence !== 'none' && (
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date (Optional)"
                        value={formData.endDate}
                        onChange={(date) => handleChange('endDate', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{
                              borderRadius: 2,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.divider,
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </motion.div>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
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
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSuccess(false)}
          sx={{ borderRadius: 2 }}
        >
          Transaction {transaction ? 'updated' : 'added'} successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default TransactionForm; 