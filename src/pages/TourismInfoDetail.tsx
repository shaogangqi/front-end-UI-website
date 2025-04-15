import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDestinationById, getTourById, postTourBooking, deleteTourBooking, getUserTourBookings } from '../api';
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import TourIcon from '@mui/icons-material/Tour';
import TimerIcon from '@mui/icons-material/Timer';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';

interface Destination {
    id: number;
    name: string;
    category: string;
    description: string;
    location: string;
    opening_hours: string;
    contact_info: string;
    img_url: string;
}

interface Tour {
    id: number;
    name: string;
    tour_type: string;
    duration: string;
    price_per_person: string;
    max_capacity: number;
    tour_date: string;
    guide_name: string;
    destination: number;
}

interface TourBooking {
    id: number;
    user_id: number;
    total_price: string;
    booking_status: boolean;
    payment_status: boolean;
    tour_id: number;
}

const TourismInfoDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [destination, setDestination] = useState<Destination | null>(null);
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userBookings, setUserBookings] = useState<TourBooking[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState<TourBooking | null>(null);
    const [totalPrice, setTotalPrice] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Get tourism information details
        getDestinationById(id)
            .then((res) => {
                console.log('Tourism Info Response:', res);
                if (res.data && res.data.data) {
                    setDestination(res.data.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching tourism information:', error);
                setError('Failed to load tourism information. Please try again later.');
                setLoading(false);
            });

        // Get tour information
        getTourById(id)
            .then((res) => {
                console.log('Tour Response:', res);
                if (res.data && res.data.data) {
                    setTour(res.data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching tour:', error);
            });

        // Get user booking list
        if (token && id) {
            getUserTourBookings()
                .then((res) => {
                    console.log('User Bookings Response:', res);
                    if (res.data && res.data.data) {
                        // Only show bookings for the current tour
                        const currentTourBookings = res.data.data.filter(
                            (booking: TourBooking) => booking.tour_id === parseInt(id)
                        );
                        setUserBookings(currentTourBookings);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user bookings:', error);
                });
        }
    }, [id]);

    const handleTourBooking = () => {
        if (!totalPrice) {
            setBookingError('Please fill in the total price');
            return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setBookingError('User ID not found, please log in again');
            return;
        }

        const bookingData = {
            total_price: totalPrice,
            booking_status: true,
            payment_status: true,
            tour_id: tour ? tour.id : 0,
            user_id: parseInt(userId, 10)
        };

        postTourBooking(bookingData)
            .then((res) => {
                console.log('Tour booking created:', res);
                setBookingSuccess(true);
                setBookingError(null);
                setTotalPrice('');
            })
            .catch((error) => {
                console.error('Error creating tour booking:', error);
                setBookingError('Failed to create booking, please try again later');
                setBookingSuccess(false);
            });
    };

    const handleDeleteBooking = async (booking: TourBooking) => {
        setCurrentBooking(booking);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteBooking = async () => {
        if (!currentBooking) return;
        
        try {
            await deleteTourBooking(currentBooking.id);
            setUserBookings(userBookings.filter(booking => booking.id !== currentBooking.id));
            setDeleteDialogOpen(false);
            setCurrentBooking(null);
        } catch (error) {
            console.error('Failed to delete booking:', error);
        }
    };

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

    if (!destination) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">No tourism information found.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={4}>
                {/* Hero Section */}
                <Box
                    sx={{
                        position: 'relative',
                        height: 400,
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 4
                    }}
                >
                    <Box
                        component="img"
                        src={destination.img_url || `https://source.unsplash.com/random/1200x800/?tourism,${destination.name}`}
                        alt={destination.name}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            p: 4,
                            color: 'white'
                        }}
                    >
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {destination.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon />
                            <Typography variant="h6">{destination.location}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            {/* Overview Card */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Destination Overview
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CategoryIcon color="primary" />
                                                <Typography>
                                                    {destination.category}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AccessTimeIcon color="primary" />
                                                <Typography>
                                                    {destination.opening_hours}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PhoneIcon color="primary" />
                                                <Typography>
                                                    {destination.contact_info}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Description Card */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        About the Destination
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                        {destination.description}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Tour Information */}
                            {tour && (
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                            <TourIcon color="primary" />
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                Tour Details
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <TimerIcon color="primary" />
                                                    <Typography>
                                                        Duration: {tour.duration}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AttachMoneyIcon color="primary" />
                                                    <Typography>
                                                        Price: ¥{tour.price_per_person}/person
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PeopleIcon color="primary" />
                                                    <Typography>
                                                        Max Capacity: {tour.max_capacity} people
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarTodayIcon color="primary" />
                                                    <Typography>
                                                        Date: {new Date(tour.tour_date).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PersonIcon color="primary" />
                                                    <Typography>
                                                        Guide: {tour.guide_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            {/* User Bookings */}
                            {userBookings.length > 0 && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Your Bookings
                                        </Typography>
                                        <Stack spacing={2}>
                                            {userBookings.map((booking) => (
                                                <Card key={booking.id} variant="outlined">
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <AttachMoneyIcon color="primary" />
                                                                    <Typography>
                                                                        Total: ¥{booking.total_price}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <PeopleIcon color="primary" />
                                                                    <Typography>
                                                                        Status: {booking.booking_status ? 'Confirmed' : 'Pending'}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                startIcon={<DeleteIcon />}
                                                                onClick={() => handleDeleteBooking(booking)}
                                                            >
                                                                Cancel Booking
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Grid>

                    {/* Booking Form Sidebar */}
                    <Grid item xs={12} md={4}>
                        {isLoggedIn && tour && (
                            <Card sx={{ position: 'sticky', top: 20 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Book Tour
                                    </Typography>
                                    <Stack spacing={3}>
                                        <TextField
                                            label="Total Price"
                                            type="number"
                                            value={totalPrice}
                                            onChange={(e) => setTotalPrice(e.target.value)}
                                            fullWidth
                                            required
                                            InputProps={{
                                                startAdornment: <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleTourBooking}
                                            disabled={!totalPrice}
                                            sx={{ py: 1.5 }}
                                        >
                                            Confirm Booking
                                        </Button>
                                        {bookingSuccess && (
                                            <Alert severity="success">
                                                Booking successful!
                                            </Alert>
                                        )}
                                        {bookingError && (
                                            <Alert severity="error">
                                                {bookingError}
                                            </Alert>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
            </Stack>

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Cancel Booking</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this booking? This operation cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDeleteBooking} color="error" autoFocus>
                        Confirm Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TourismInfoDetail;