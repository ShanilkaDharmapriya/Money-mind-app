import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Stack,
  Paper,
  Avatar,
  useTheme,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subMonths } from 'date-fns';
import { motion } from 'framer-motion';

const FilterDrawer = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onReset,
  categories,
  tags,
}) => {
  const theme = useTheme();

  const hasActiveFilters = filters.category || filters.startDate || filters.endDate || filters.tags.length > 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 450 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                }}
              >
                <FilterIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filters
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Refine your transaction view
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.primary.light}05 100%)`,
                  border: `1px solid ${theme.palette.primary.light}30`,
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                    Active Filters
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {filters.category && (
                    <Chip
                      label={`Category: ${filters.category}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.startDate && (
                    <Chip
                      label={`From: ${format(filters.startDate, 'MMM dd, yyyy')}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.endDate && (
                    <Chip
                      label={`To: ${format(filters.endDate, 'MMM dd, yyyy')}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={`Tag: ${tag}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Paper>
            </motion.div>
          )}

          <Stack spacing={3}>
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => onFilterChange('category', e.target.value)}
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
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </motion.div>

            {/* Date Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => onFilterChange('startDate', date)}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => onFilterChange('endDate', date)}
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

            {/* Tags Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => onFilterChange('tags', tag)}
                      color={filters.tags.includes(tag) ? 'primary' : 'default'}
                      variant={filters.tags.includes(tag) ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.light + '20',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={onReset}
                  startIcon={<ClearIcon />}
                  sx={{
                    borderRadius: 2,
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    '&:hover': {
                      borderColor: theme.palette.error.dark,
                      backgroundColor: theme.palette.error.light + '10',
                    },
                  }}
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={onClose}
                  sx={{
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Apply Filters
                </Button>
              </Box>
            </motion.div>
          </Stack>
        </Box>
      </motion.div>
    </Drawer>
  );
};

export default FilterDrawer; 