import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransportation } from '../api';
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Define transport provider interface
interface TransportProvider {
    id: number;
    name: string;
    service_type: string;
    base_fare: string;
    price_per_km: string;
    contact_info: string;
    img_url?: string;
}

const Transport = () => {
    const navigate = useNavigate();
    const [transportProviders, setTransportProviders] = useState<TransportProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransportProviders = async () => {
            try {
                const response = await getTransportation();
                if (response.data.code === 200) {
                    setTransportProviders(response.data.data);
                } else {
                    setError('Failed to fetch transport providers');
                }
            } catch (error) {
                console.error('Error fetching transport providers:', error);
                setError('An error occurred while fetching transport providers');
            } finally {
                setLoading(false);
            }
        };

        fetchTransportProviders();
    }, []);

    const handleLearnMore = (id: number) => {
        navigate(`/transport/${id}`);
    };

    const transportationCard = (provider: TransportProvider) => (
        <Card 
            elevation={2}
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={provider.img_url || `https://picsum.photos/800/600?random=${provider.id}`}
                alt={provider.name}
                sx={{ 
                    objectFit: 'cover',
                    bgcolor: 'grey.200'
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        {provider.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCarIcon color="primary" />
                        <Typography variant="body2">
                            {provider.service_type}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalTaxiIcon color="primary" />
                        <Typography variant="body2">
                            Base Fare: ${provider.base_fare}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon color="primary" />
                        <Typography variant="body2">
                            ${provider.price_per_km}/km
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon color="primary" />
                        <Typography variant="body2">
                            {provider.contact_info}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    onClick={() => handleLearnMore(provider.id)}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    fullWidth
                    sx={{
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    View Details & Book
                </Button>
            </CardActions>
        </Card>
    );

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Transportation Services
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Find the perfect transportation for your journey
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {transportProviders.map(provider => (
                    <Grid item xs={12} sm={6} md={4} key={provider.id}>
                        {transportationCard(provider)}
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Transport;