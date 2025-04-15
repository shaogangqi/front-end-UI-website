import React, { useState, useEffect } from "react";
import { getRestaurants } from "../api"; // Import the API function to get restaurants
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField"; // Ensure TextField is imported
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Restaurant {
    id: number;
    name: string;
    location: string;
    cuisine_type: string;
    opening_hours: string;
    contact_info: string;
    img_url: string;
}

const Restaurants = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch restaurant data
    useEffect(() => {
        getRestaurants()
            .then((res) => {
                console.log("Fetched restaurants: ", res.data);
                if (res.data && res.data.data) {
                    setRestaurants(res.data.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching restaurants: ", error);
                setError("Failed to fetch restaurant information");
                setLoading(false);
            });
    }, []);

    // Handle table reservation
    const handleReservation = () => {
        console.log(`Reserved table on ${selectedDate}`);
    };

    const customCard = (restaurant: Restaurant) => (
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
                image={restaurant.img_url || `https://source.unsplash.com/random/800x600/?restaurant,${restaurant.name}`}
                alt={restaurant.name}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        {restaurant.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2">{restaurant.location}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RestaurantIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                            {restaurant.cuisine_type}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                            {restaurant.opening_hours}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                            {restaurant.contact_info}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    href={`/restaurants/${restaurant.id}`}
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

    if (loading) return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Discover Restaurants
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Explore our curated selection of fine dining establishments
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        </Container>
    );

    if (error) return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Discover Restaurants
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Explore our curated selection of fine dining establishments
                </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Discover Restaurants
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Explore our curated selection of fine dining establishments
                </Typography>
            </Box>

            {restaurants && restaurants.length > 0 ? (
                <Grid container spacing={3}>
                    {restaurants.map((restaurant) => (
                        <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                            {customCard(restaurant)}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No restaurants available at the moment
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default Restaurants;