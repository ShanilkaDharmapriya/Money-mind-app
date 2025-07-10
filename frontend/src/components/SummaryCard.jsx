import { Paper, Typography, Box, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';

const AnimatedTypography = animated(Typography);

const SummaryCard = ({ title, value, icon, color, trend }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    config: { tension: 20, friction: 10 },
  });

  const getColorConfig = (color) => {
    const colorMap = {
      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
        bg: '#e8f5e8',
        border: '#4caf50',
      },
      error: {
        main: '#d32f2f',
        light: '#f44336',
        dark: '#c62828',
        bg: '#ffebee',
        border: '#f44336',
      },
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        bg: '#e3f2fd',
        border: '#42a5f5',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        bg: '#fff3e0',
        border: '#ff9800',
      },
      info: {
        main: '#0288d1',
        light: '#29b6f6',
        dark: '#01579b',
        bg: '#e1f5fe',
        border: '#29b6f6',
      },
    };
    return colorMap[color] || colorMap.primary;
  };

  const colorConfig = getColorConfig(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          background: `linear-gradient(135deg, ${colorConfig.bg} 0%, ${colorConfig.bg}80 100%)`,
          border: `2px solid ${colorConfig.border}30`,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            borderColor: colorConfig.border,
            boxShadow: `0 8px 32px ${colorConfig.border}20`,
            transform: 'translateY(-4px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${colorConfig.main} 0%, ${colorConfig.light} 100%)`,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: colorConfig.main + '20',
                color: colorConfig.main,
                width: 48,
                height: 48,
                border: `2px solid ${colorConfig.main}30`,
              }}
            >
              {icon}
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>
          {trend && (
            <Chip
              label={trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              size="small"
              sx={{
                backgroundColor: trend === 'up' ? '#4caf50' : trend === 'down' ? '#f44336' : '#9e9e9e',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>
        
        <AnimatedTypography
          variant="h4"
          component="div"
          sx={{ 
            fontWeight: 700,
            mb: 1,
            color: colorConfig.main,
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          {number.to((n) => `$${n.toFixed(2)}`)}
        </AnimatedTypography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: colorConfig.main,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: `0 0 0 0 ${colorConfig.main}40`,
                },
                '70%': {
                  boxShadow: `0 0 0 10px ${colorConfig.main}00`,
                },
                '100%': {
                  boxShadow: `0 0 0 0 ${colorConfig.main}00`,
                },
              },
            }}
          />
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default SummaryCard; 