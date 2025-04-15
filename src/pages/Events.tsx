import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../api';
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get events list
        getEvents()
            .then((res) => {
                console.log('Events Response:', res);
                if (res.data && res.data.data) {
                    setEvents(res.data.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
                setError('Failed to load events. Please try again later.');
                setLoading(false);
            });
    }, []);

    const handleLearnMore = (eventId: number) => {
        navigate(`/events/${eventId}`);
    };

    const customCard = (event: Event) => (
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
                image={event.img_url || `https://picsum.photos/800/600?random=${event.id}`}
                alt={event.name}
                sx={{ 
                    objectFit: 'cover',
                    bgcolor: 'grey.200'
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        {event.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2">{event.venue}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                            {new Date(event.event_date).toLocaleDateString()}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                            {event.start_time} - {event.end_time}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                            Max {event.max_participants} participants
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaymentIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                            Entry Fee: ${event.entry_fee}
                        </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {event.description}
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    onClick={() => handleLearnMore(event.id)}
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
                    Upcoming Events
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Discover exciting events and book your spot
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            ) : events && events.length > 0 ? (
                <Grid container spacing={3}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                            {customCard(event)}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No events available at the moment
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default Events;