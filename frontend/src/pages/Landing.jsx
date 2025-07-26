import { Box, Container, Typography, Button, Paper, Stack, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import React from 'react';
import ReactLogo from '../assets/react.svg';

const Landing = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 4,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.1)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img src={ReactLogo} alt="Money Mind Logo" style={{ height: 90, marginBottom: 24 }} />
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
              Money Mind
            </Typography>
            <Typography variant="h5" sx={{ mb: 3, color: 'text.secondary', fontWeight: 400 }}>
              Take control of your finances. Track your spending, set goals, and achieve financial freedom with Money Mind.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mt: 4 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                size="large"
                sx={{ borderRadius: 3, px: 5, fontWeight: 600 }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="outlined"
                size="large"
                sx={{ borderRadius: 3, px: 5, fontWeight: 600 }}
              >
                Register
              </Button>
            </Stack>
          </motion.div>
        </Paper>
      </Container>
    </Box>
  );
};

export default Landing; 