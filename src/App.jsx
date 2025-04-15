import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Blog from './Blog';
import SignIn from './SignIn'; // Import SignIn component
import SignUp from './SignUp'; // Import SignUp component
import MainContent from './components/MainContent';
import TourismInfo from './pages/TourismInfo';
import Accommodation from './pages/Accommodation';
import Restaurants from './pages/Restaurants';
import Events from './pages/Events';
import Transport from './pages/Transport';
import Button from '@mui/material/Button'; // Import Button component
import AccommodationDetail from './pages/AccommodationDetail'; 
import EventDetail from './pages/EventDetail';
import TourismInfoDetail from './pages/TourismInfoDetail';
import RestaurantDetail from './pages/RestaurantDetail';
import TransportDetail from './pages/TransportDetail';
import axios from './api/axios'; // Ensure the correct axios instance is imported
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  Event as EventIcon,
  DirectionsBus as TransportIcon,
  Article as BlogIcon,
  Info as InfoIcon,
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.request({
            url: '/customUser/me/',
            method: 'get'
          });
          setIsLoggedIn(true);
          if (response.data && response.data.id) {
            localStorage.setItem('userId', response.data.id.toString());
          } else if (response.data && response.data.data && response.data.data.id) {
            // If id is inside the data object
            localStorage.setItem('userId', response.data.data.id.toString());
          } else {
            console.error('Failed to get a valid user ID', response.data);
            // Optionally clear the token here if no valid user info is retrieved
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []);


  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Tourism Info', icon: <InfoIcon />, path: '/tourism-info' },
    { text: 'Accommodation', icon: <HotelIcon />, path: '/accommodation' },
    { text: 'Restaurants', icon: <RestaurantIcon />, path: '/restaurants' },
    { text: 'Events', icon: <EventIcon />, path: '/events' },
    { text: 'Transport', icon: <TransportIcon />, path: '/transport' },
    { text: 'Blog', icon: <BlogIcon />, path: '/blog' },
  ];

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            component={Link} 
            to={item.path} 
            key={item.text}
            onClick={() => setMobileOpen(false)}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        {isLoggedIn ? (
          <ListItem 
            onClick={handleSignOut}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        ) : (
          <>
            <ListItem 
              component={Link} 
              to="/sign-in" 
              onClick={() => setMobileOpen(false)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem 
              component={Link} 
              to="/sign-up" 
              onClick={() => setMobileOpen(false)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon><SignUpIcon /></ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component={Link} to="/" sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold'
            }}>
              Travel Explorer
            </Typography>
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                ))}
                {isLoggedIn ? (
                  <Button
                    color="inherit"
                    onClick={handleSignOut}
                    startIcon={<LogoutIcon />}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/sign-in"
                      startIcon={<LoginIcon />}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      component={Link}
                      to="/sign-up"
                      startIcon={<SignUpIcon />}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              backgroundColor: theme.palette.background.default
            },
          }}
        >
          {drawer}
        </Drawer>

        <Container component="main" sx={{ flex: 1, py: 4 }}>
          <Routes>
            <Route path="/sign-in" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/" element={<Blog />} /> {/* Homepage Blog */}
            <Route path="/login" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/sign-up" element={<SignUp />} /> {/* Add SignUp page route */}
            <Route path="/main-content" element={<MainContent />} /> {/* Fix duplicate route */}
            <Route path="/tourism-info" element={<TourismInfo />} />
            <Route path="/accommodation" element={<Accommodation />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/accommodation/:id" element={<AccommodationDetail />} />
            <Route path="/tourism-info/:id" element={<TourismInfoDetail />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/transport/:id" element={<TransportDetail />} />
          </Routes>
        </Container>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" align="center">
              © {new Date().getFullYear()} Travel Explorer. All rights reserved.
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Discover the world with us - Your ultimate travel companion
            </Typography>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;