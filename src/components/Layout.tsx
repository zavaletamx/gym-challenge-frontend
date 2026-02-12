import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, BottomNavigation, BottomNavigationAction, Paper, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HistoryIcon from '@mui/icons-material/History';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    // Decide active tab based on path
    const getValue = () => {
        const path = location.pathname;
        if (path === '/' || path.includes('dashboard')) return 0;
        if (path.includes('checkin')) return 1;
        if (path.includes('history')) return 2;
        if (path.includes('ranking')) return 3;
        return 0;
    };

    const [value, setValue] = React.useState(getValue());

    return (
        <Box sx={{ pb: 7, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        GymCheck
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>{user?.name}</Typography>
                    <IconButton color="inherit" onClick={logout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <Outlet />
            </Box>

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(_event, newValue) => {
                        setValue(newValue);
                        switch (newValue) {
                            case 0: navigate('/'); break;
                            case 1: navigate('/checkin'); break;
                            case 2: navigate('/history'); break;
                            case 3: navigate('/ranking'); break;
                        }
                    }}
                >
                    <BottomNavigationAction label="Home" icon={<DashboardIcon />} />
                    <BottomNavigationAction label="Check-In" icon={<AddPhotoAlternateIcon />} />
                    <BottomNavigationAction label="History" icon={<HistoryIcon />} />
                    <BottomNavigationAction label="Rank" icon={<EmojiEventsIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default Layout;
