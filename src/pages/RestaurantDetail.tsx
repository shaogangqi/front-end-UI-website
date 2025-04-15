import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById, getRestaurantMenus, postTableReservation, getTableReservations, deleteTableReservation } from '../api';
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
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';

interface Restaurant {
    id: number;
    name: string;
    description: string;
    location: string;
    opening_hours: string;
    contact_info: string;
    img_url: string;
    cuisine_type: string;
}

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    restaurant: number;
}

interface Reservation {
    id: number;
    user_id: number;
    restaurant_id: number;
    reservation_date: string;
    reservation_time: string;
    number_of_guests: number;
    special_requests: string;
    status: string;
}

const RestaurantDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userReservations, setUserReservations] = useState<Reservation[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [reservationSuccess, setReservationSuccess] = useState(false);
    const [reservationError, setReservationError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        if (!id) {
            setError('Restaurant ID is required');
            setLoading(false);
            return;
        }

        // Get restaurant details
        getRestaurantById(id)
            .then((res) => {
                console.log('Restaurant Response:', res);
                if (res.data && res.data.data) {
                    setRestaurant(res.data.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching restaurant:', error);
                setError('Failed to load restaurant information. Please try again later.');
                setLoading(false);
            });

        // Get restaurant menu
        getRestaurantMenus(id)
            .then((res) => {
                console.log('Menu Response:', res);
                if (res.data && res.data.data) {
                    setMenuItems(res.data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching menu:', error);
            });

        // Get user reservations
        if (token && id) {
            getTableReservations()
                .then((res) => {
                    console.log('User Reservations Response:', res);
                    if (res.data && res.data.data) {
                        // Only show reservations for the current restaurant
                        const currentRestaurantReservations = res.data.data.filter(
                            (reservation: Reservation) => reservation.restaurant_id === parseInt(id)
                        );
                        setUserReservations(currentRestaurantReservations);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user reservations:', error);
                });
        }
    }, [id]);

    const handleReservation = () => {
        if (!id) {
            setReservationError('Restaurant ID is required');
            return;
        }

        if (!reservationDate || !reservationTime || !numberOfGuests) {
            setReservationError('Please fill in all required fields');
            return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setReservationError('User ID not found, please log in again');
            return;
        }

        const reservationData = {
            restaurant_id: parseInt(id),
            user_id: parseInt(userId),
            reservation_date: reservationDate,
            reservation_time: reservationTime,
            number_of_guests: parseInt(numberOfGuests),
            special_requests: specialRequests,
            status: 'pending'
        };

        postTableReservation(reservationData)
            .then((res) => {
                console.log('Reservation created:', res);
                setReservationSuccess(true);
                setReservationError(null);
                setReservationDate('');
                setReservationTime('');
                setNumberOfGuests('');
                setSpecialRequests('');
            })
            .catch((error) => {
                console.error('Error creating reservation:', error);
                setReservationError('Failed to create reservation, please try again later');
                setReservationSuccess(false);
            });
    };

    const handleDeleteReservation = async (reservation: Reservation) => {
        setCurrentReservation(reservation);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteReservation = async () => {
        if (!currentReservation) return;
        
        try {
            await deleteTableReservation(currentReservation.id);
            setUserReservations(userReservations.filter(reservation => reservation.id !== currentReservation.id));
            setDeleteDialogOpen(false);
            setCurrentReservation(null);
        } catch (error) {
            console.error('Failed to delete reservation:', error);
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

    if (!restaurant) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">Restaurant not found.</Alert>
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
                        src={restaurant.img_url || `https://source.unsplash.com/random/1200x800/?restaurant,${restaurant.name}`}
                        alt={restaurant.name}
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
                            {restaurant.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon />
                            <Typography variant="h6">{restaurant.location}</Typography>
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
                                        Restaurant Overview
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <RestaurantIcon color="primary" />
                                                <Typography>
                                                    {restaurant.cuisine_type}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AccessTimeIcon color="primary" />
                                                <Typography>
                                                    {restaurant.opening_hours}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PhoneIcon color="primary" />
                                                <Typography>
                                                    {restaurant.contact_info}
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
                                        About the Restaurant
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                        {restaurant.description}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Menu Items */}
                            {menuItems.length > 0 && (
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <MenuBookIcon color="primary" />
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                Menu
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={2}>
                                            {menuItems.map((item) => (
                                                <Grid item xs={12} sm={6} key={item.id}>
                                                    <Card variant="outlined">
                                                        <CardContent>
                                                            <Typography variant="h6" gutterBottom>
                                                                {item.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                                {item.description}
                                                            </Typography>
                                                            <Typography variant="h6" color="primary">
                                                                ¥{item.price}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Category: {item.category}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            {/* User Reservations */}
                            {userReservations.length > 0 && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Your Reservations
                                        </Typography>
                                        <Stack spacing={2}>
                                            {userReservations.map((reservation) => (
                                                <Card key={reservation.id} variant="outlined">
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <CalendarTodayIcon color="primary" />
                                                                    <Typography>
                                                                        {new Date(reservation.reservation_date).toLocaleDateString()}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <AccessTimeIcon color="primary" />
                                                                    <Typography>
                                                                        {reservation.reservation_time}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <PeopleIcon color="primary" />
                                                                    <Typography>
                                                                        {reservation.number_of_guests} guests
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            {reservation.special_requests && (
                                                                <Grid item xs={12} sm={6}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <CommentIcon color="primary" />
                                                                        <Typography>
                                                                            {reservation.special_requests}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                startIcon={<DeleteIcon />}
                                                                onClick={() => handleDeleteReservation(reservation)}
                                                            >
                                                                Cancel Reservation
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

                    {/* Reservation Form Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ position: 'sticky', top: 20 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Make a Reservation
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Reservation Date"
                                        type="date"
                                        value={reservationDate}
                                        onChange={(e) => setReservationDate(e.target.value)}
                                        fullWidth
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        }}
                                    />
                                    <TextField
                                        label="Reservation Time"
                                        type="time"
                                        value={reservationTime}
                                        onChange={(e) => setReservationTime(e.target.value)}
                                        fullWidth
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        }}
                                    />
                                    <TextField
                                        label="Number of Guests"
                                        type="number"
                                        value={numberOfGuests}
                                        onChange={(e) => setNumberOfGuests(e.target.value)}
                                        fullWidth
                                        required
                                        InputProps={{
                                            startAdornment: <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        }}
                                    />
                                    <TextField
                                        label="Special Requests"
                                        multiline
                                        rows={2}
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <CommentIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleReservation}
                                        disabled={!reservationDate || !reservationTime || !numberOfGuests}
                                        sx={{ py: 1.5 }}
                                    >
                                        Confirm Reservation
                                    </Button>
                                    {reservationSuccess && (
                                        <Alert severity="success">
                                            Reservation successful!
                                        </Alert>
                                    )}
                                    {reservationError && (
                                        <Alert severity="error">
                                            {reservationError}
                                        </Alert>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Cancel Reservation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this reservation? This operation cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDeleteReservation} color="error" autoFocus>
                        Confirm Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RestaurantDetail;