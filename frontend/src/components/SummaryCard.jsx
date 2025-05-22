import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';

const AnimatedTypography = animated(Typography);

const SummaryCard = ({ title, value, icon, color, trend }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    config: { tension: 20, friction: 10 },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          p: 3,
          height: '100%',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${color}30`,
          borderRadius: 4,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <AnimatedTypography
          variant="h4"
          component="div"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          {number.to((n) => `$${n.toFixed(2)}`)}
        </AnimatedTypography>
        {trend && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: trend > 0 ? 'success.main' : 'error.main',
            }}
          >
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </Typography>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default SummaryCard; 