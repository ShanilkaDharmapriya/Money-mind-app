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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subMonths } from 'date-fns';

const FilterDrawer = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onReset,
  categories,
  tags,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(date) => onFilterChange('startDate', date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(date) => onFilterChange('endDate', date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => onFilterChange('tags', tag)}
                color={filters.tags.includes(tag) ? 'primary' : 'default'}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={onClose}
          >
            Apply
          </Button>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default FilterDrawer; 