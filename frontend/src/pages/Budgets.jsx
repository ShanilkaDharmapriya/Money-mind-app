import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Fade,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useBudgets } from '../contexts/BudgetContext';

const Budgets = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { budgets, loading, error, addBudget, updateBudget, deleteBudget, refreshBudgets } = useBudgets();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    refreshBudgets();
  }, []);

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleDeleteBudget = (budget) => {
    setBudgetToDelete(budget);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await deleteBudget(budgetToDelete._id);
    setDeleteConfirmOpen(false);
    setBudgetToDelete(null);
    setSuccess(true);
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
                      bgcolor: theme.palette.info.main,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Budgets
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage your spending plans and stay on track
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
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddBudget}
                    size="large"
                    sx={{ 
                      borderRadius: 3,
                      px: 3,
                      background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                      boxShadow: theme.shadows[3],
                      '&:hover': {
                        boxShadow: theme.shadows[6],
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Add Budget
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <Fade in={loading}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
              <LinearProgress sx={{ width: '100%', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Loading your budgets...
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

        {/* Budgets List */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {budgets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: 'transparent',
                    border: '2px dashed',
                    borderColor: 'divider',
                    maxWidth: 500,
                    mx: 'auto',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
                      boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                  <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                    No Budgets Yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    Start by creating your first budget to manage your spending!
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddBudget}
                    size="large"
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
                      boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Create Your First Budget
                  </Button>
                </Paper>
              </motion.div>
            ) : (
              <Grid container spacing={3}>
                {budgets.map((budget) => (
                  <Grid item xs={12} md={6} lg={4} key={budget._id}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                          border: `1px solid ${theme.palette.divider}`,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8],
                          },
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {budget.category}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Amount: ${budget.amount}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {format(new Date(budget.startDate), 'MMM dd, yyyy')} - {format(new Date(budget.endDate), 'MMM dd, yyyy')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit Budget">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditBudget(budget)}
                                  sx={{ color: theme.palette.info.main }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Budget">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteBudget(budget)}
                                  sx={{ color: theme.palette.error.main }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        )}

        {/* Budget Form Dialog */}
        <BudgetFormDialog
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          budget={editingBudget}
          onSave={async (budgetData) => {
            if (editingBudget) {
              await updateBudget(editingBudget._id, budgetData);
            } else {
              await addBudget(budgetData);
            }
            setIsFormOpen(false);
            setSuccess(true);
          }}
        />

        {/* Delete Confirmation Dialog */}
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
              Are you sure you want to delete this budget? This action cannot be undone.
            </Typography>
            {budgetToDelete && (
              <Paper
                sx={{
                  p: 2,
                  background: theme.palette.grey[50],
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Budget Details:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {budgetToDelete.category} - ${budgetToDelete.amount}
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

        {/* Success Snackbar */}
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
            Budget {editingBudget ? 'updated' : 'created'} successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

// Budget Form Dialog Component
const BudgetFormDialog = ({ open, onClose, budget, onSave }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    category: budget?.category || 'Monthly',
    amount: budget?.amount || '',
    startDate: budget?.startDate ? new Date(budget.startDate) : new Date(),
    endDate: budget?.endDate ? new Date(budget.endDate) : new Date(),
  });

  const categories = [
    'Monthly',
    'Groceries',
    'Utilities',
    'Entertainment',
    'Transport',
    'Healthcare',
    'Other',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
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
              bgcolor: theme.palette.info.main,
              width: 48,
              height: 48,
            }}
          >
            {budget ? <EditIcon /> : <AddIcon />}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {budget ? 'Edit Budget' : 'Create New Budget'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {budget ? 'Update your budget details' : 'Set a new budget'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  label="Category"
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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                required
                InputProps={{
                  startAdornment: <MoneyIcon color="action" sx={{ mr: 1 }} />,
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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate.toISOString().split('T')[0]}
                onChange={(e) => handleChange('startDate', new Date(e.target.value))}
                required
                InputLabelProps={{ shrink: true }}
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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate.toISOString().split('T')[0]}
                onChange={(e) => handleChange('endDate', new Date(e.target.value))}
                required
                InputLabelProps={{ shrink: true }}
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
            </Grid>
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
            background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {budget ? 'Update' : 'Create'} Budget
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Budgets; 