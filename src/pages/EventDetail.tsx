import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, getEventPromotion, postVenueBooking, calculateVenueBookingPrice, cancelVenueBooking, getUserVenueBookings } from '../api';
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ImageIcon from '@mui/icons-material/Image';

interface Event {
    id: number;
    name: string;
    venue: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    entry_fee: string;
    max_participants: number;
    img_url?: string;
}

interface Promotion {
    id: number;
    event: number;
    promotion_start_date: string;
    promotion_end_date: string;
    discount: string;
}

interface Booking {
    id: number;
    user_id: number;
    booking_date: string;
    booking_status: boolean;
    number_of_tickets: number;
    total_amount: string;
    discount_amount: string;
    event_id: number;
    promotion_id: number;
}

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(true);
    const [numberOfTickets, setNumberOfTickets] = useState<number | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState(false);
    const [calculatedPrice, setCalculatedPrice] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);
    const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
    const [userBookings, setUserBookings] = useState<Booking[]>([]);

    useEffect(() => {
        // Get event details
        getEventById(id)
            .then((res) => {
                console.log('Event Response:', res);
                if (res.data && res.data.data) {
                    setEvent(res.data.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching event:', error);
                setLoading(false);
            });

        // Get event promotion information
        getEventPromotion()
            .then((res) => {
                console.log('Promotion Response:', res);
                if (res.data && res.data.data) {
                    const promotionsData = res.data.data;
                    if (Array.isArray(promotionsData)) {
                        const relatedPromotion = promotionsData.find((promo: Promotion) => promo.event === Number(id));
                        setPromotion(relatedPromotion || null);
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching event promotion:', error);
            });

        // Get user booking information
        const userId = localStorage.getItem('userId');
        if (userId) {
            getUserVenueBookings(id)
                .then((res) => {
                    if (res.data && res.data.data) {
                        const bookings = res.data.data.filter((booking: Booking) => 
                            booking.user_id === parseInt(userId, 10) && booking.booking_status
                        );
                        setUserBookings(bookings);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user bookings:', error);
                });
        }
    }, [id]);

    const handleNumberOfTicketsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setNumberOfTickets(value);
        
        if (value > 0 && event) {
            calculateVenueBookingPrice({
                event: Number(id),
                number_of_tickets: value
            })
                .then((res) => {
                    if (res.data) {
                        setCalculatedPrice(res.data.total_amount);
                    }
                })
                .catch((error) => {
                    console.error('Error calculating price:', error);
                });
        }
    };

    const handleVenueBooking = () => {
        if (numberOfTickets === null || numberOfTickets <= 0) {
            setBookingError(true);
            return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setBookingError(true);
            console.error('User ID not found');
            alert('Invalid login information, please log in again.');
            return;
        }

        const bookingData = {
            booking_date: new Date().toISOString(),
            booking_status: true,
            number_of_tickets: numberOfTickets,
            total_amount: calculatedPrice || "0",
            discount_amount: promotion ? (Number(calculatedPrice) * Number(promotion.discount) / 100).toString() : "0",
            event_id: Number(id),
            user_id: parseInt(userId, 10),
            ...(promotion && { promotion_id: promotion.id })
        };

        postVenueBooking(bookingData)
            .then((res) => {
                console.log('Venue booking submitted:', res);
                setBookingSuccess(true);
                setBookingError(false);
                setNumberOfTickets(null);
                setCalculatedPrice(null);
            })
            .catch((error) => {
                console.error('Error submitting venue booking:', error);
                setBookingError(true);
            });
    };

    const handleCancelBookingClick = (booking: Booking) => {
        setCurrentBooking(booking);
        setCancelDialogOpen(true);
    };

    const handleCancelBookingConfirm = () => {
        if (!currentBooking) return;

        cancelVenueBooking(currentBooking.id)
            .then(() => {
                setCancelDialogOpen(false);
                setCurrentBooking(null);
                // Refresh page or update state
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error canceling booking:', error);
                if (error.response?.status === 401) {
                    setCancelError('You do not have permission to cancel this booking. Please log in first.');
                } else {
                    setCancelError('An error occurred while canceling the booking. Please try again later.');
                }
            });
    };

    const handleCancelBookingCancel = () => {
        setCancelDialogOpen(false);
        setCurrentBooking(null);
        setCancelError(null);
    };

    if (loading) return <div>Loading...</div>;

    if (!event) return <div>No event found.</div>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Typography>Loading event details...</Typography>
                </Box>
            ) : !event ? (
                <Alert severity="error">No event found.</Alert>
            ) : (
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
                            src={event.img_url || `https://picsum.photos/1200/800?random=${event.id}`}
                            alt={event.name}
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
                                {event.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon />
                                <Typography variant="h6">{event.venue}</Typography>
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
                                            Event Overview
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <EventIcon color="primary" />
                                                    <Typography>
                                                        {new Date(event.event_date).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AccessTimeIcon color="primary" />
                                                    <Typography>
                                                        {event.start_time} - {event.end_time}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PeopleIcon color="primary" />
                                                    <Typography>
                                                        Max {event.max_participants} participants
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PaymentIcon color="primary" />
                                                    <Typography>
                                                        Entry Fee: ${event.entry_fee}
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
                                            About the Event
                                        </Typography>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                            {event.description}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {/* Promotion Card */}
                                {promotion && (
                                    <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <LocalOfferIcon />
                                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                    Special Promotion
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarTodayIcon />
                                                        <Typography>
                                                            {new Date(promotion.promotion_start_date).toLocaleDateString()} - 
                                                            {new Date(promotion.promotion_end_date).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PaymentIcon />
                                                        <Typography>
                                                            {promotion.discount}% OFF
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
                                                                        <CalendarTodayIcon color="primary" />
                                                                        <Typography>
                                                                            {new Date(booking.booking_date).toLocaleDateString()}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={12} sm={6}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <ConfirmationNumberIcon color="primary" />
                                                                        <Typography>
                                                                            {booking.number_of_tickets} tickets
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={12} sm={6}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <PaymentIcon color="primary" />
                                                                        <Typography>
                                                                            Total: ${booking.total_amount}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                {booking.discount_amount !== "0" && (
                                                                    <Grid item xs={12} sm={6}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <LocalOfferIcon color="success" />
                                                                            <Typography color="success.main">
                                                                                Saved: ${booking.discount_amount}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                )}
                                                            </Grid>
                                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    onClick={() => handleCancelBookingClick(booking)}
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
                                        Book Tickets
                                    </Typography>
                                    <Stack spacing={3}>
                                        <TextField
                                            label="Number of Tickets"
                                            type="number"
                                            value={numberOfTickets !== null ? numberOfTickets : ''}
                                            onChange={handleNumberOfTicketsChange}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <ConfirmationNumberIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            }}
                                        />
                                        {calculatedPrice && (
                                            <Box sx={{ 
                                                p: 2, 
                                                bgcolor: 'primary.light', 
                                                color: 'primary.contrastText',
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Total Amount: ${calculatedPrice}
                                                </Typography>
                                                {promotion && (
                                                    <Typography variant="body2">
                                                        Including {promotion.discount}% discount
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleVenueBooking}
                                            disabled={!numberOfTickets || numberOfTickets <= 0}
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
                                                Booking failed, please check your input.
                                            </Alert>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            )}

            {/* Cancel booking confirmation dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={handleCancelBookingCancel}
            >
                <DialogTitle>Confirm Booking Cancellation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this booking? This action cannot be undone.
                    </DialogContentText>
                    {cancelError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {cancelError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelBookingCancel}>Cancel</Button>
                    <Button onClick={handleCancelBookingConfirm} color="error" autoFocus>
                        Confirm Cancellation
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EventDetail;