import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProviderById, getRoutePlan, getTrafficUpdate, postRideBooking, deleteRideBooking, getUserRideBookings } from '../api';
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RouteIcon from '@mui/icons-material/Route';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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

// Define route plan interface
interface RoutePlan {
    id: number;
    start_location: string;
    end_location: string;
    distance: string;
    estimated_time: string;
    provider_id: number;
}

// Define traffic update interface
interface TrafficUpdate {
    id: number;
    update_time: string;
    update_message: string;
    provider_id: number;
}

// Define ride booking interface
interface RideBooking {
    id: number;
    user_id: number;
    pickup_location: string;
    drop_off_location: string;
    ride_date: string;
    pickup_time: string;
    estimated_fare: string;
    booking_status: boolean;
    provider_id: number;
}

const TransportDetail = () => {
    const { id } = useParams();  // Current transport provider id
    const [provider, setProvider] = useState<TransportProvider | null>(null);
    const [routePlans, setRoutePlans] = useState<RoutePlan[]>([]);
    const [trafficUpdates, setTrafficUpdates] = useState<TrafficUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [userBookings, setUserBookings] = useState<RideBooking[]>([]); // User booking list state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete confirmation dialog state
    const [currentBooking, setCurrentBooking] = useState<RideBooking | null>(null); // Current booking to delete state

    // Ride booking state
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [rideDate, setRideDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch transport provider information
                const providerResponse = await getProviderById(id);
                console.log('Transport Provider Response:', providerResponse);
                
                // Extract data according to API response structure
                if (providerResponse.data.code === 200) {
                    setProvider(providerResponse.data.data); // Extract data part
                } else {
                    console.error('Error: ', providerResponse.data.msg);
                }

                // Fetch route planning information related to the current transport provider
                const routeResponse = await getRoutePlan(); // No need to pass parameters
                console.log('Route Plan Response:', routeResponse);
                if (routeResponse.data.code === 200) {
                    setRoutePlans(routeResponse.data.data.filter((route: RoutePlan) => route.provider_id === Number(id))); // Filter routes for the current provider
                } else {
                    console.error('Error fetching route plans:', routeResponse.data.msg);
                }

                // Fetch traffic updates for the transport provider
                const trafficResponse = await getTrafficUpdate();
                console.log('Traffic Update Response:', trafficResponse);
                if (trafficResponse.data.code === 200) {
                    const updates = trafficResponse.data.data.filter((update: TrafficUpdate) => update.provider_id === Number(id)); // Filter updates for the current provider
                    setTrafficUpdates(updates);
                } else {
                    console.error('Error fetching traffic updates:', trafficResponse.data.msg);
                }

                // Get user booking list
                const userId = localStorage.getItem('userId');
                if (userId) {
                    try {
                        const bookingsResponse = await getUserRideBookings();
                        console.log('User Bookings Response:', bookingsResponse);
                        if (bookingsResponse.data && bookingsResponse.data.data) {
                            const userBookings = bookingsResponse.data.data.filter(
                                (booking: RideBooking) => 
                                    booking.user_id === parseInt(userId, 10) && 
                                    booking.provider_id === Number(id)
                            );
                            setUserBookings(userBookings);
                        }
                    } catch (error) {
                        console.error('Error fetching user bookings:', error);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleRideBooking = () => {
        if (!pickupLocation || !dropOffLocation || !rideDate || !pickupTime) {
            setBookingError(true);
            console.error('Please fill in all fields.');
            return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setBookingError(true);
            console.error('User ID not found');
            alert('Invalid login information, please log in again.');
            return;
        }

        const rideData = {
            pickup_location: pickupLocation,
            drop_off_location: dropOffLocation,
            ride_date: rideDate,
            pickup_time: pickupTime,
            estimated_fare: '0', // Can be calculated based on business logic
            booking_status: true,
            user_id: parseInt(userId, 10),
            provider_id: Number(id)
        };

        console.log('Submitting ride booking data:', rideData);

        postRideBooking(rideData)
            .then((res) => {
                console.log('Ride booking submitted:', res);
                setBookingSuccess(true);
                setBookingError(false);
                setPickupLocation('');
                setDropOffLocation('');
                setRideDate('');
                setPickupTime('');
            })
            .catch((error) => {
                console.error('Error submitting ride booking:', error);
                if (error.response && error.response.data) {
                    console.error('Error details:', error.response.data);
                }
                setBookingError(true);
            });
    };

    // Handle booking deletion
    const handleDeleteBooking = (booking: RideBooking) => {
        setCurrentBooking(booking);
        setDeleteDialogOpen(true);
    };

    // Confirm booking deletion
    const confirmDeleteBooking = async () => {
        if (!currentBooking) return;
        
        try {
            await deleteRideBooking(currentBooking.id);
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

    if (!provider) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">No transport provider found.</Alert>
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
                        src={provider.img_url || `https://picsum.photos/1200/800?random=${provider.id}`}
                        alt={provider.name}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            bgcolor: 'grey.200'
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
                            {provider.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DirectionsCarIcon />
                            <Typography variant="h6">{provider.service_type}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            {/* Provider Overview */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Service Overview
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocalTaxiIcon color="primary" />
                                                <Typography>
                                                    Base Fare: ${provider.base_fare}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AttachMoneyIcon color="primary" />
                                                <Typography>
                                                    ${provider.price_per_km}/km
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PhoneIcon color="primary" />
                                                <Typography>
                                                    {provider.contact_info}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Route Plans */}
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                        <RouteIcon color="primary" />
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            Route Planning
                                        </Typography>
                                    </Box>
                                    {routePlans.length > 0 ? (
                                        <Stack spacing={2}>
                                            {routePlans.map((route) => (
                                                <Card key={`route-${route.id}`} variant="outlined">
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <LocationOnIcon color="primary" />
                                                                    <Typography>
                                                                        From: {route.start_location}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <LocationOnIcon color="primary" />
                                                                    <Typography>
                                                                        To: {route.end_location}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <RouteIcon color="primary" />
                                                                    <Typography>
                                                                        Distance: {route.distance} km
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <AccessTimeIcon color="primary" />
                                                                    <Typography>
                                                                        Time: {route.estimated_time}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body1" color="text.secondary">
                                            No route planning available for this provider.
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Traffic Updates */}
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                        <UpdateIcon color="primary" />
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            Traffic Updates
                                        </Typography>
                                    </Box>
                                    {trafficUpdates.length > 0 ? (
                                        <Stack spacing={2}>
                                            {trafficUpdates.map((update) => (
                                                <Card key={`update-${update.id}`} variant="outlined">
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <AccessTimeIcon color="primary" />
                                                            <Typography>
                                                                {new Date(update.update_time).toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1" sx={{ ml: 4 }}>
                                                            {update.update_message}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body1" color="text.secondary">
                                            No traffic updates available for this provider.
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>

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
                                                                    <LocationOnIcon color="primary" />
                                                                    <Typography>
                                                                        From: {booking.pickup_location}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <LocationOnIcon color="primary" />
                                                                    <Typography>
                                                                        To: {booking.drop_off_location}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <CalendarTodayIcon color="primary" />
                                                                    <Typography>
                                                                        Date: {booking.ride_date}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <AccessTimeIcon color="primary" />
                                                                    <Typography>
                                                                        Time: {booking.pickup_time}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <AttachMoneyIcon color="primary" />
                                                                    <Typography>
                                                                        Fare: ${booking.estimated_fare}
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
                        <Card sx={{ position: 'sticky', top: 20 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Book a Ride
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Pickup Location"
                                        value={pickupLocation}
                                        onChange={(e) => setPickupLocation(e.target.value)}
                                        fullWidth
                                        required
                                        InputProps={{
                                            startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        }}
                                    />
                                    <TextField
                                        label="Drop-off Location"
                                        value={dropOffLocation}
                                        onChange={(e) => setDropOffLocation(e.target.value)}
                                        fullWidth
                                        required
                                        InputProps={{
                                            startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        }}
                                    />
                                    <TextField
                                        label="Ride Date"
                                        type="date"
                                        value={rideDate}
                                        onChange={(e) => setRideDate(e.target.value)}
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
                                        label="Pickup Time"
                                        type="time"
                                        value={pickupTime}
                                        onChange={(e) => setPickupTime(e.target.value)}
                                        fullWidth
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleRideBooking}
                                        disabled={!pickupLocation || !dropOffLocation || !rideDate || !pickupTime}
                                        sx={{ py: 1.5 }}
                                    >
                                        Book Now
                                    </Button>
                                    {bookingSuccess && (
                                        <Alert severity="success">
                                            Ride booked successfully!
                                        </Alert>
                                    )}
                                    {bookingError && (
                                        <Alert severity="error">
                                            Error booking ride. Please check your input.
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
                <DialogTitle>Confirm Booking Cancellation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this booking? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDeleteBooking} color="error" autoFocus>
                        Confirm Cancellation
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TransportDetail;