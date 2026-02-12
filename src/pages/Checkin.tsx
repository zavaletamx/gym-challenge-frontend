import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Checkin = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getLocation = () => {
        setLocLoading(true);
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLocLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocLoading(false);
            },
            (_err) => {
                setError('Unable to retrieve your location. Please allow access.');
                setLocLoading(false);
            }
        );
    };

    useEffect(() => {
        getLocation(); // Auto get location on load
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedInfo = e.target.files[0];
            setFile(selectedInfo);
            setPreview(URL.createObjectURL(selectedInfo));
        }
    };

    const handleSubmit = async () => {
        if (!location || !file) {
            setError('Location and photo are required');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('latitude', location.lat.toString());
        formData.append('longitude', location.lng.toString());

        try {
            await api.post('/checkins', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Checkin failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5">Daily Check-in</Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>1. Location</Typography>
                {locLoading ? <CircularProgress size={20} /> : (
                    location ?
                        <Typography color="success.main">Location acquired: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</Typography> :
                        <Button onClick={getLocation} variant="outlined">Get Location</Button>
                )}
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>2. Evidence Photo</Typography>
                <Button variant="outlined" component="label" fullWidth sx={{ height: 100, borderStyle: 'dashed' }}>
                    {preview ? <img src={preview} alt="Preview" style={{ maxHeight: '100%', objectFit: 'contain' }} /> : 'Take Photo / Upload'}
                    <input type="file" hidden accept="image/*" capture="environment" onChange={handleFileChange} />
                </Button>
            </Paper>

            <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading || !location || !file}
            >
                {loading ? <CircularProgress size={24} /> : 'Submit Check-in'}
            </Button>
        </Box>
    );
};

export default Checkin;
