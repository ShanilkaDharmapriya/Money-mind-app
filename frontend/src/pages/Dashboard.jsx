import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  Skeleton,
  LinearProgress,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Badge,
  Avatar,
  CircularProgress,
} from '@mui/material';
import Grid from "@mui/material/Grid";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Savings as SavingsIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import axios from 'axios';

const drawerWidth = 280;

const motivationalQuotes = [
  "Every penny saved is a penny earned.",
  "Financial freedom is a journey, not a destination.",
  "Small steps today lead to big results tomorrow.",
  "Your financial future is created by what you do today.",
];

const Dashboard = ({ onToggleColorMode, mode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDashboardData(response.data);
        setNotification({
          open: true,
          message: 'Dashboard data loaded successfully!',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.message || 'Failed to load dashboard data');
        setNotification({
          open: true,
          message: error.response?.data?.message || 'Error loading dashboard data',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  const renderWelcomeBanner = () => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        color: 'white',
        borderRadius: 4,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'white',
              color: theme.palette.primary.main,
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.username}!
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {getRandomQuote()}
          </Typography>
        </Grid>
        <Grid item>
          <Chip
            label={user?.role === 'admin' ? 'Administrator' : 'User'}
            color={user?.role === 'admin' ? 'secondary' : 'primary'}
            sx={{ color: 'white' }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderLoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Card>
            <CardContent>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" sx={{ mt: 2 }} />
              <Skeleton variant="text" width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderErrorState = () => (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="error" gutterBottom>
        Oops! Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {error}
      </Typography>
      <IconButton
        onClick={() => window.location.reload()}
        sx={{ mt: 2 }}
        color="primary"
      >
        <CircularProgress size={24} />
      </IconButton>
    </Paper>
  );

  const renderSummaryCards = () => {
    if (!dashboardData) return null;

    const cards = user?.role === 'admin' ? [
      {
        title: 'Total Users',
        value: dashboardData.usersCount?.toLocaleString?.() ?? '0',
        icon: <PeopleIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.primary.main,
        progress: 100,
      },
      {
        title: 'Total Transactions',
        value: dashboardData.totalTransactions?.toLocaleString?.() ?? '0',
        icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.success.main,
        progress: 100,
      },
      {
        title: 'Total Income',
        value: `$${dashboardData.totalIncome?.toLocaleString?.() ?? '0.00'}`,
        icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.warning.main,
        progress: 100,
      },
      {
        title: 'Total Expenses',
        value: `$${dashboardData.totalExpenses?.toLocaleString?.() ?? '0.00'}`,
        icon: <SavingsIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.secondary.main,
        progress: 100,
      },
    ] : [
      {
        title: 'Total Balance',
        value: `$${((dashboardData.totalIncome ?? 0) - (dashboardData.totalExpenses ?? 0)).toLocaleString?.() ?? '0.00'}`,
        icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.primary.main,
        progress: 100,
      },
      {
        title: 'Monthly Income',
        value: `$${dashboardData.totalIncome?.toLocaleString?.() ?? '0.00'}`,
        icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.success.main,
        progress: 100,
      },
      {
        title: 'Monthly Expenses',
        value: `$${dashboardData.totalExpenses?.toLocaleString?.() ?? '0.00'}`,
        icon: <SavingsIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.warning.main,
        progress: 100,
      },
      {
        title: 'Goals Progress',
        value: `${Math.round(((dashboardData.goals?.filter(g => g.completed)?.length ?? 0) / (dashboardData.goals?.length ?? 1)) * 100)}%`,
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.secondary.main,
        progress: ((dashboardData.goals?.filter(g => g.completed)?.length ?? 0) / (dashboardData.goals?.length ?? 1)) * 100,
      },
    ];

    return (
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${card.color}15`,
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {card.value}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={card.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${card.color}15`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: card.color,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Money Mind
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem selected>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {user?.role === 'admin' && (
          <>
            <ListItem>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </>
        )}
        <ListItem button component={RouterLink} to="/transactions">
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItem>
        <ListItem button component={RouterLink} to="/goals">
          <ListItemIcon>
            <SavingsIcon />
          </ListItemIcon>
          <ListItemText primary="Goals" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CalendarIcon />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton color="inherit" onClick={onToggleColorMode}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Container maxWidth="xl">
          {renderWelcomeBanner()}
          {loading ? renderLoadingSkeleton() : error ? renderErrorState() : renderSummaryCards()}

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid xs={12} md={8}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 400,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Financial Overview
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: 'Jan', income: 4000, expenses: 2400 },
                      { name: 'Feb', income: 3000, expenses: 1398 },
                      { name: 'Mar', income: 2000, expenses: 9800 },
                      { name: 'Apr', income: 2780, expenses: 3908 },
                      { name: 'May', income: 1890, expenses: 4800 },
                      { name: 'Jun', income: 2390, expenses: 3800 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke={theme.palette.success.main}
                      name="Income"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke={theme.palette.error.main}
                      name="Expenses"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 400,
                  overflow: 'auto',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Recent Transactions
                </Typography>
                {dashboardData?.recentTransactions?.map((transaction, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {transaction.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={transaction.category}
                          size="small"
                          sx={{
                            backgroundColor: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(transaction.date), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="subtitle1"
                      color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}$
                      {transaction.amount?.toLocaleString?.() ?? '0.00'}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard; 