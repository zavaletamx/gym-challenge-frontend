import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Detail = () => {
    const { id } = useParams();
    const [chekin, setCheckin] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const { data } = await api.get(`/checkins/${id}`);
                setCheckin(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/checkins/${id}`);
            navigate('/history');
        } catch (e) {
            alert('Failed to delete');
        }
    }

    if (loading) return <CircularProgress />;
    if (!chekin) return <Typography>Not found</Typography>;

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5">Check-in Detail</Typography>

            <Paper sx={{ p: 2 }}>
                <Typography variant="body1">By: {chekin.user.name}</Typography>
                <Typography variant="body2" color="text.secondary">{new Date(chekin.createdAt).toLocaleString()}</Typography>
            </Paper>

            <Paper sx={{ p: 2, height: 300 }}>
                <MapContainer center={[chekin.latitude, chekin.longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[chekin.latitude, chekin.longitude]}>
                        <Popup>
                            Check-in Location
                        </Popup>
                    </Marker>
                </MapContainer>
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">Evidence Photo</Typography>
                <img
                    src={`http://localhost:3000${chekin.imageUrl}`}
                    alt="Evidence"
                    style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
                />
            </Paper>

            <Button variant="outlined" color="error" onClick={handleDelete}>Delete Entry</Button>
        </Box>
    );
};

export default Detail;
