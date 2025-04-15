import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAccommodationById, getGuestService, getAccommodationRoomTypes, postRoomBooking, postFeedbackReview, getAccommodationFeedback, deleteRoomBooking, deleteRoomType, deleteFeedback } from '../api'; 
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button"; 
import TextField from "@mui/material/TextField"; 
import Alert from "@mui/material/Alert"; 
import MenuItem from '@mui/material/MenuItem'; 
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import WifiIcon from '@mui/icons-material/Wifi';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SpaIcon from '@mui/icons-material/Spa';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';

// Define GuestService type
interface GuestService {
    id: number;
    service_name: string;
    price: number;
    availability_hours: string;
    accommodation_id: number;
}

// Define RoomType type
interface RoomType {
    id: number;
    room_type: string;
    price_per_night: string;
    max_occupancy: number;
    availability: boolean;
}

// Define Accommodation type
interface Accommodation {
    id: number;
    name: string;
    location: string;
    star_rating: number;
    total_rooms: number;
    check_in_time: string;
    check_out_time: string;
    contact_info: string;
    description: string;
    image_url: string;
    amenities: string;
}

interface Feedback {
    id: number;
    accommodation_id: number;
    user_id: number;
    user_name: string;
    rating: number;
    review: string;
    date: string;
}

interface RoomBooking {
    id: number;
    room_type_id: number;
    user_id: number;
    check_in_date: string;
    check_out_date: string;
}

const AccommodationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
    const [guestServices, setGuestServices] = useState<GuestService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [userBookings, setUserBookings] = useState<RoomBooking[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackError, setFeedbackError] = useState<string | null>(null);
    const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);
    const [currentBooking, setCurrentBooking] = useState<RoomBooking | null>(null);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        setIsLoggedIn(!!token);
        console.log('Token:', token);
    
        // Get accommodation details
        getAccommodationById(id)
            .then((res) => {
                console.log('Accommodation data:', res.data);
                if (res.data && res.data.data) {
                    setAccommodation(res.data.data);
                } else {
                    setAccommodation(res.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching accommodation:', error);
                setLoading(false);
            });
    
        getGuestService()
            .then((res) => {
                const servicesData = res.data.data || [];
                const filteredServices = servicesData.filter((service: GuestService) => 
                    service.accommodation_id === Number(id)
                );
                setGuestServices(filteredServices);
            })
            .catch((error) => {
                console.error('Error fetching guest services:', error);
            });

        // Get all feedback
        getAccommodationFeedback(id)
            .then((res) => {
                console.log('Feedbacks:', res.data);
                if (res.data && res.data.data) {
                    setFeedbacks(res.data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching feedbacks:', error);
            });

        // Get room types
        getAccommodationRoomTypes(id)
            .then((res) => {
                console.log('Room types:', res.data);
                if (res.data && res.data.data) {
                    setRoomTypes(res.data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching room types:', error);
            });
    }, [id]);

    const handleRoomBooking = () => {
        console.log('isLoggedIn:', isLoggedIn);
        if (!isLoggedIn) {
            setError('User not authenticated');
            console.error('User not authenticated');
            alert('Please log in before making a reservation.');
            return;
        }
    
        if (!currentBooking || !currentBooking.check_in_date || !currentBooking.check_out_date) {
            setError('Please fill in all fields.');
            console.error('Please fill in all fields.');
            return;
        }
    
        if (new Date(currentBooking.check_in_date) >= new Date(currentBooking.check_out_date)) {
            setError('Check-out date must be later than check-in date.');
            console.error('Check-out date must be later than check-in date.');
            return;
        }
    
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('User ID not found');
            console.error('User ID not found');
            alert('Invalid login information, please log in again.');
            return;
        }
    
        const bookingData = {
            check_in_date: currentBooking.check_in_date,
            check_out_date: currentBooking.check_out_date,
            room_type_id: currentBooking.room_type_id,
            accommodation_id: Number(id),
            user_id: parseInt(userId, 10), // Use parseInt to ensure conversion to integer
        };
    
        console.log('Booking data:', bookingData);
        const token = localStorage.getItem('token');
        console.log('Sending booking request, token:', token);
        postRoomBooking(bookingData)
        .then((response) => {
            console.log('Booking successful:', response);
            setFeedbackSuccess('Booking successful!');
            setError(null);
            // ... Reset form fields ...
        })
        .catch((error) => {
            console.error('Room booking failed:', error);
            setError(error.message || 'Booking failed, please try again later.');
        });
    };

    const handleFeedbackSubmit = () => {
        if (feedbackRating === null || feedbackText.trim() === '') {
            setFeedbackError('Please fill in all fields.');
            return;
        }

        const feedbackData = {
            rating: feedbackRating,
            review: feedbackText,
            date: new Date().toISOString().split('T')[0], // Current date
            accommodation_id: Number(id),
            user: parseInt(localStorage.getItem('userId') || '0', 10) // Get user ID from local storage
        };

        postFeedbackReview(feedbackData)
            .then((res) => {
                console.log('Feedback submitted:', res);
                setFeedbackSuccess('Feedback submitted successfully!');
                setFeedbackError(null);
                setFeedbackText('');
                setFeedbackRating(5);
            })
            .catch((error) => {
                console.error('Error submitting feedback:', error);
                setFeedbackError('Feedback submission failed, please try again later.');
            });
    };

    const handleCancelBookingClick = (booking: RoomBooking) => {
        setCurrentBooking(booking);
        setCancelDialogOpen(true);
    };

    const handleCancelBookingConfirm = () => {
        if (!currentBooking) return;

        deleteRoomBooking(currentBooking.id)
            .then(() => {
                setCancelDialogOpen(false);
                // Refresh page
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error deleting:', error);
                if (error.response?.status === 401) {
                    setCancelError('You do not have permission to perform this action. Please log in first.');
                } else {
                    setCancelError('Failed to cancel booking, please try again later.');
                }
            });
    };

    const handleCancelBookingCancel = () => {
        setCancelDialogOpen(false);
        setCurrentBooking(null);
        setCancelError(null);
    };

    const handleDeleteFeedback = (feedbackId: number) => {
        if (!isLoggedIn) {
            alert('Please log in first');
            return;
        }

        if (window.confirm('Are you sure you want to delete this review?')) {
            deleteFeedback(feedbackId)
                .then(() => {
                    // Update feedback list after successful deletion
                    setFeedbacks(feedbacks.filter(f => f.id !== feedbackId));
                    alert('Review deleted');
                })
                .catch((error) => {
                    console.error('Error deleting feedback:', error);
                    if (error.response?.status === 401) {
                        alert('You do not have permission to perform this action');
                    } else {
                        alert('Deletion failed, please try again later');
                    }
                });
        }
    };

    const getAmenityIcon = (amenity: string) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes('wifi')) return <WifiIcon />;
        if (amenityLower.includes('pool')) return <PoolIcon />;
        if (amenityLower.includes('restaurant')) return <RestaurantIcon />;
        if (amenityLower.includes('spa')) return <SpaIcon />;
        if (amenityLower.includes('fitness')) return <FitnessCenterIcon />;
        return <HotelIcon />;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Typography>Loading accommodation details...</Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            ) : accommodation ? (
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
                            src={accommodation.image_url}
                            alt={accommodation.name}
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
                                {accommodation.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon />
                                <Typography variant="h6">{accommodation.location}</Typography>
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
                                            Overview
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <HotelIcon color="primary" />
                                                    <Typography>
                                                        {accommodation.total_rooms} Rooms Available
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AccessTimeIcon color="primary" />
                                                    <Typography>
                                                        Check-in: {accommodation.check_in_time}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AccessTimeIcon color="primary" />
                                                    <Typography>
                                                        Check-out: {accommodation.check_out_time}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PhoneIcon color="primary" />
                                                    <Typography>{accommodation.contact_info}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* Amenities Card */}
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Amenities
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            {accommodation.amenities.split(',').map((amenity, index) => (
                                                <Chip
                                                    key={index}
                                                    icon={getAmenityIcon(amenity)}
                                                    label={amenity.trim()}
                                                    sx={{
                                                        backgroundColor: 'primary.light',
                                                        color: 'primary.contrastText',
                                                        '& .MuiChip-icon': {
                                                            color: 'inherit'
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Room Types Card */}
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Room Types
                                        </Typography>
                                        <Stack spacing={2}>
                                            {roomTypes.map((room) => (
                                                <Card key={room.id} variant="outlined">
                                                    <CardContent>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography variant="h6">
                                                                    {room.room_type}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={3}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <PeopleIcon color="primary" />
                                                                    <Typography>
                                                                        Max {room.max_occupancy} guests
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={3}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <PaymentIcon color="primary" />
                                                                    <Typography>
                                                                        ${room.price_per_night}/night
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={2}>
                                                                <Button
                                                                    variant="contained"
                                                                    fullWidth
                                                                    disabled={!room.availability}
                                                                    onClick={() => handleRoomSelection(room)}
                                                                >
                                                                    {room.availability ? 'Book Now' : 'Sold Out'}
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Reviews Section */}
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                Guest Reviews
                                            </Typography>
                                            {isLoggedIn && (
                                                <Button
                                                    variant="contained"
                                                    onClick={() => setShowFeedbackForm(true)}
                                                >
                                                    Write a Review
                                                </Button>
                                            )}
                                        </Box>

                                        {showFeedbackForm && (
                                            <Box sx={{ mb: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    value={feedbackText}
                                                    onChange={(e) => setFeedbackText(e.target.value)}
                                                    placeholder="Share your experience..."
                                                    sx={{ mb: 2 }}
                                                />
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <Typography>Rating:</Typography>
                                                    <Rating
                                                        value={feedbackRating}
                                                        onChange={(_, newValue) => {
                                                            setFeedbackRating(newValue || 0);
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleFeedbackSubmit}
                                                        disabled={!feedbackText.trim()}
                                                    >
                                                        Submit Review
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => {
                                                            setShowFeedbackForm(false);
                                                            setFeedbackText('');
                                                            setFeedbackRating(5);
                                                            setFeedbackError(null);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                                {feedbackError && (
                                                    <Alert severity="error" sx={{ mt: 2 }}>
                                                        {feedbackError}
                                                    </Alert>
                                                )}
                                                {feedbackSuccess && (
                                                    <Alert severity="success" sx={{ mt: 2 }}>
                                                        {feedbackSuccess}
                                                    </Alert>
                                                )}
                                            </Box>
                                        )}

                                        <Stack spacing={2}>
                                            {feedbacks.map((feedback) => (
                                                <Card key={feedback.id} variant="outlined">
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                                    {feedback.user_name}
                                                                </Typography>
                                                                <Rating value={feedback.rating} readOnly size="small" />
                                                            </Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {new Date(feedback.date).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1">
                                                            {feedback.review}
                                                        </Typography>
                                                        {feedback.user_id === Number(localStorage.getItem('userId')) && (
                                                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                                                <Button
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteFeedback(feedback.id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </Box>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>

                        {/* Booking Form Sidebar */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ position: 'sticky', top: 20 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Book Your Stay
                                    </Typography>
                                    <Stack spacing={3}>
                                        <TextField
                                            label="Check-in Date"
                                            type="date"
                                            value={currentBooking?.check_in_date || ''}
                                            onChange={(e) => handleBookingChange('check_in_date', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Check-out Date"
                                            type="date"
                                            value={currentBooking?.check_out_date || ''}
                                            onChange={(e) => handleBookingChange('check_out_date', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                        />
                                        <TextField
                                            select
                                            label="Room Type"
                                            value={currentBooking?.room_type_id || ''}
                                            onChange={(e) => handleBookingChange('room_type_id', e.target.value)}
                                            fullWidth
                                        >
                                            {roomTypes.map((room) => (
                                                <MenuItem key={room.id} value={room.id}>
                                                    {room.room_type} - ${room.price_per_night}/night
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleRoomBooking}
                                            disabled={!isLoggedIn}
                                            sx={{ py: 1.5 }}
                                        >
                                            {isLoggedIn ? 'Book Now' : 'Sign in to Book'}
                                        </Button>
                                        {!isLoggedIn && (
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                Please sign in to make a booking
                                            </Typography>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            ) : (
                <Typography>Accommodation information not found</Typography>
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

export default AccommodationDetail;