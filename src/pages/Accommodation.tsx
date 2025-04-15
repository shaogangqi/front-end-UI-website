import React, { useState, useEffect } from "react";
import { getAccommodations } from "../api";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography"; 
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Define Accommodation type
interface Accommodation {
    id: number;
    name: string;
    location: string;
    star_rating: number;
    total_rooms: number;
    amenities: string;
    check_in_time: string;
    check_out_time: string;
    contact_info: string;
    img_url: string;
    types: number[];
}

const Accommodation = () => {
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAccommodations()
            .then((res) => {
                console.log(res.data);
                if (res.data && res.data.data) {
                    setAccommodations(res.data.data);
                } else {
                    console.error('Invalid data structure:', res.data);
                    setAccommodations([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setAccommodations([]);
                setLoading(false);
            });
    }, []);

    const customCard = (accommodation: Accommodation) => (
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
                image={accommodation.img_url || 'https://via.placeholder.com/300x200?text=Hotel+Image'}
                alt={accommodation.name}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                            {accommodation.name}
                        </Typography>
                        <Rating 
                            value={accommodation.star_rating} 
                            readOnly 
                            precision={0.5}
                            sx={{ color: 'primary.main' }}
                        />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2">{accommodation.location}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HotelIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                            {accommodation.total_rooms} Rooms Available
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {accommodation.amenities.split(',').map((amenity, index) => (
                            <Chip
                                key={index}
                                label={amenity.trim()}
                                size="small"
                                sx={{ 
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText'
                                }}
                            />
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                            Check-in: {accommodation.check_in_time} | Check-out: {accommodation.check_out_time}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">{accommodation.contact_info}</Typography>
                    </Box>
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    component={Link}
                    to={`/accommodation/${accommodation.id}`}
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

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Find Your Perfect Stay
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Discover our selection of premium accommodations for your next journey
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Typography>Loading accommodations...</Typography>
                </Box>
            ) : accommodations && accommodations.length > 0 ? (
                <Grid container spacing={3}>
                    {accommodations.map((accommodation) => (
                        <Grid item xs={12} sm={6} md={4} key={accommodation.id}>
                            {customCard(accommodation)}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No accommodations available at the moment
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default Accommodation;