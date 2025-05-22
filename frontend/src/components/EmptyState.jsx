import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const EmptyState = ({ title, message, actionLabel, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          background: 'transparent',
        }}
      >
        <Box
          component="img"
          src="/empty-state.svg"
          alt="No transactions"
          sx={{
            width: 200,
            height: 200,
            mb: 3,
            opacity: 0.8,
          }}
        />
        <Typography variant="h5" color="text.primary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {message}
        </Typography>
        {actionLabel && onAction && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAction}
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            {actionLabel}
          </Button>
        )}
      </Paper>
    </motion.div>
  );
};

export default EmptyState; 