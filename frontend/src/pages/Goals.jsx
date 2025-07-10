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
  Flag as FlagIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrackChanges as TargetIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useGoals } from '../contexts/GoalContext';

const Goals = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { goals, loading, error, addGoal, updateGoal, deleteGoal, refreshGoals } = useGoals();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    refreshGoals();
  }, []);

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return theme.palette.success.main;
    if (progress >= 75) return theme.palette.info.main;
    if (progress >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getDaysRemaining = (deadline) => {
    const days = differenceInDays(new Date(deadline), new Date());
    return days > 0 ? days : 0;
  };

  const getStatusColor = (deadline, progress) => {
    if (progress >= 100) return 'success';
    if (isAfter(new Date(deadline), new Date())) return 'warning';
    return 'error';
  };

  const getStatusText = (deadline, progress) => {
    if (progress >= 100) return 'Completed';
    if (isAfter(new Date(deadline), new Date())) return 'On Track';
    return 'Overdue';
  };

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
  const completedGoals = goals.filter(goal => calculateProgress(goal.currentAmount, goal.targetAmount) >= 100).length;

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

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDeleteGoal = (goal) => {
    setGoalToDelete(goal);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await deleteGoal(goalToDelete._id);
    setDeleteConfirmOpen(false);
    setGoalToDelete(null);
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
                      bgcolor: theme.palette.warning.main,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <FlagIcon />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Financial Goals
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Track your progress and achieve your dreams
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
                    onClick={handleAddGoal}
                    size="large"
                    sx={{ 
                      borderRadius: 3,
                      px: 3,
                      background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                      boxShadow: theme.shadows[3],
                      '&:hover': {
                        boxShadow: theme.shadows[6],
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Add Goal
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
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.success.light}15 0%, ${theme.palette.success.light}05 100%)`,
                    border: `1px solid ${theme.palette.success.light}30`,
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
                          backgroundColor: theme.palette.success.light + '20',
                          color: theme.palette.success.main,
                          mr: 2,
                        }}
                      >
                        <TargetIcon />
                      </Avatar>
                      <Typography variant="h6" color="text.secondary">
                        Total Progress
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {totalProgress.toFixed(1)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={totalProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: theme.palette.success.light + '30',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.success.main,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
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
                        <MoneyIcon />
                      </Avatar>
                      <Typography variant="h6" color="text.secondary">
                        Total Saved
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ${totalCurrentAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      of ${totalTargetAmount.toLocaleString()} target
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.warning.light}15 0%, ${theme.palette.warning.light}05 100%)`,
                    border: `1px solid ${theme.palette.warning.light}30`,
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
                          backgroundColor: theme.palette.warning.light + '20',
                          color: theme.palette.warning.main,
                          mr: 2,
                        }}
                      >
                        <CheckCircleIcon />
                      </Avatar>
                      <Typography variant="h6" color="text.secondary">
                        Completed
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {completedGoals}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      of {goals.length} goals
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.primary.light}05 100%)`,
                    border: `1px solid ${theme.palette.primary.light}30`,
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
                          backgroundColor: theme.palette.primary.light + '20',
                          color: theme.palette.primary.main,
                          mr: 2,
                        }}
                      >
                        <AutoAwesomeIcon />
                      </Avatar>
                      <Typography variant="h6" color="text.secondary">
                        Auto Save
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {goals.reduce((sum, goal) => sum + goal.autoSavePercentage, 0)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      total allocation
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <Fade in={loading}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
              <LinearProgress sx={{ width: '100%', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Loading your goals...
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

        {/* Goals List */}
        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {goals.length === 0 ? (
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
                      background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                      boxShadow: '0 8px 32px rgba(255, 152, 0, 0.3)',
                    }}
                  >
                    <FlagIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                  <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                    No Goals Yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    Start your financial journey by setting your first goal. Track your progress and achieve your dreams!
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddGoal}
                    size="large"
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                      boxShadow: '0 4px 16px rgba(255, 152, 0, 0.3)',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(255, 152, 0, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Create Your First Goal
                  </Button>
                </Paper>
              </motion.div>
            ) : (
              <Grid container spacing={3}>
                {goals.map((goal) => {
                  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                  const daysRemaining = getDaysRemaining(goal.deadline);
                  const statusColor = getStatusColor(goal.deadline, progress);
                  const statusText = getStatusText(goal.deadline, progress);

                  return (
                    <Grid item xs={12} md={6} lg={4} key={goal._id}>
                      <motion.div variants={itemVariants}>
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
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '4px',
                              height: '100%',
                              background: `linear-gradient(180deg, ${getProgressColor(progress)} 0%, ${getProgressColor(progress)}80 100%)`,
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {goal.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {goal.description}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Goal">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditGoal(goal)}
                                    sx={{ color: theme.palette.info.main }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Goal">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeleteGoal(goal)}
                                    sx={{ color: theme.palette.error.main }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Progress
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {progress.toFixed(1)}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: getProgressColor(progress) + '20',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: getProgressColor(progress),
                                  },
                                }}
                              />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Current
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  ${goal.currentAmount.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" color="text.secondary">
                                  Target
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  ${goal.targetAmount.toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                  {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                                </Typography>
                              </Box>
                              <Chip
                                label={statusText}
                                size="small"
                                color={statusColor}
                                sx={{ borderRadius: 2 }}
                              />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AutoAwesomeIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                  Auto-save: {goal.autoSavePercentage}%
                                </Typography>
                              </Box>
                              {daysRemaining > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  {daysRemaining} days left
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </motion.div>
        )}

        {/* Goal Form Dialog */}
        <GoalFormDialog
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          goal={editingGoal}
          onSave={(goalData) => {
            if (editingGoal) {
              updateGoal(editingGoal._id, goalData);
            } else {
              addGoal(goalData);
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
              Are you sure you want to delete this goal? This action cannot be undone.
            </Typography>
            {goalToDelete && (
              <Paper
                sx={{
                  p: 2,
                  background: theme.palette.grey[50],
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Goal Details:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {goalToDelete.title} - ${goalToDelete.targetAmount.toLocaleString()}
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
            Goal {editingGoal ? 'updated' : 'created'} successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

// Goal Form Dialog Component
const GoalFormDialog = ({ open, onClose, goal, onSave }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    targetAmount: goal?.targetAmount || '',
    currentAmount: goal?.currentAmount || 0,
    deadline: goal?.deadline ? new Date(goal.deadline) : new Date(),
    autoSavePercentage: goal?.autoSavePercentage || 0,
    category: goal?.category || 'Savings',
  });

  const categories = [
    'Savings',
    'Travel',
    'Transportation',
    'Education',
    'Home',
    'Business',
    'Emergency Fund',
    'Investment',
    'Other',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
              bgcolor: theme.palette.warning.main,
              width: 48,
              height: 48,
            }}
          >
            {goal ? <EditIcon /> : <AddIcon />}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {goal ? 'Edit Goal' : 'Create New Goal'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {goal ? 'Update your goal details' : 'Set a new financial target'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Goal Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
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
                label="Target Amount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => handleChange('targetAmount', parseFloat(e.target.value))}
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
                label="Current Amount"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => handleChange('currentAmount', parseFloat(e.target.value))}
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={(date) => handleChange('deadline', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <CalendarIcon color="action" sx={{ mr: 1 }} />,
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
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Auto-save Percentage"
                type="number"
                value={formData.autoSavePercentage}
                onChange={(e) => handleChange('autoSavePercentage', parseFloat(e.target.value))}
                InputProps={{
                  endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                multiline
                rows={3}
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
            background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {goal ? 'Update' : 'Create'} Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Goals; 