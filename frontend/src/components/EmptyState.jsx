import { Box, Typography, Button, Paper, Avatar } from '@mui/material';
import { Add as AddIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
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
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
            }}
          >
            <ReceiptIcon sx={{ fontSize: 60 }} />
          </Avatar>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography 
            variant="h4" 
            color="text.primary" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 2,
            }}
          >
            {title}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
            sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              mb: 4,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            {message}
          </Typography>
        </motion.div>

        {actionLabel && onAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAction}
              size="large"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {actionLabel}
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                  },
                },
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                animation: 'pulse 2s infinite 0.3s',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                  },
                },
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                animation: 'pulse 2s infinite 0.6s',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                  },
                },
              }}
            />
          </Box>
        </motion.div>
      </Paper>
    </motion.div>
  );
};

export default EmptyState; 