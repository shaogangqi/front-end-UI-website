import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDestinations } from '../api';
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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface TourismInfo {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
    opening_hours: string;
    contact_info: string;
    img_url: string;
}

const TourismInfo = () => {
    const navigate = useNavigate();
    const [tourismInfo, setTourismInfo] = useState<TourismInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get tourism information list
        getDestinations()
            .then((res) => {
                console.log('Tourism Info Response:', res);
                if (res.data && res.data.data) {
                    setTourismInfo(res.data.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching tourism information:', error);
                setError('Failed to load tourism information. Please try again later.');
                setLoading(false);
            });
    }, []);

    const handleLearnMore = (infoId: number) => {
        navigate(`/tourism-info/${infoId}`);
    };

    const customCard = (info: TourismInfo) => (
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
                image={info.img_url || `https://source.unsplash.com/random/800x600/?tourism,${info.name}`}
                alt={info.name}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        {info.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2">{info.location}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                            {info.category}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                            {info.opening_hours}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    onClick={() => handleLearnMore(info.id)}
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
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Discover Tourist Attractions
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Explore the most popular tourist destinations and attractions
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            ) : tourismInfo && tourismInfo.length > 0 ? (
                <Grid container spacing={3}>
                    {tourismInfo.map((info) => (
                        <Grid item xs={12} sm={6} md={4} key={info.id}>
                            {customCard(info)}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No tourist attractions available at the moment
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default TourismInfo;