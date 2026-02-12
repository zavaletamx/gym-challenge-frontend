import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6750A4', // M3 Purple
        },
        secondary: {
            main: '#625B71',
        },
        error: {
            main: '#B3261E',
        },
        background: {
            default: '#FEF7FF',
            paper: '#F3EDF7',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
                },
            },
        },
    },
});

export default theme;
