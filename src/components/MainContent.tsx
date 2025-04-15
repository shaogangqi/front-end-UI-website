import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';

const cardData = [
  {
    img: 'https://picsum.photos/800/450?random=1',
    tag: 'Tourism Information Center',
    title: 'To store visitor information about various destinations',
    description:
      'The Tourism Information Center(TIC) offers Visitor Information, Tour Bookings, and Event Notifications.',
    authors: [
      { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
      { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
    ],
    link: '/tourism-info', // 跳转路径
  },
  {
    img: 'https://picsum.photos/800/450?random=2',
    tag: 'Accommodation Providers',
    title: 'To store accommodation information',
    description:
      'Accommodation Providers(AP) manage Room Bookings, Guest Services, and Feedback and Reviews.',
    authors: [{ name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg' }],
    link: '/accommodation', // 跳转路径
  },
  {
    img: 'https://picsum.photos/800/450?random=3',
    tag: 'Restaurants and Cafes',
    title: 'To store restaurant and cafe information',
    description:
      'Restaurants and Cafes(RC) offer Table Reservations, Menu Recommendations, and Online Ordering.',
    authors: [{ name: 'Kate Morrison', avatar: '/static/images/avatar/7.jpg' }],
    link: '/restaurants', // 跳转路径
  },
  {
    img: 'https://picsum.photos/800/450?random=4',
    tag: 'Event Organizers',
    title: 'To store details of events',
    description:
      'Event Organizers(EO) handle Event Scheduling, Venue Bookings, and Event Promotion.',
    authors: [{ name: 'Cindy Baker', avatar: '/static/images/avatar/3.jpg' }],
    link: '/events', // 跳转路径
  },
  {
    img: 'https://picsum.photos/800/450?random=5',
    tag: 'Local Transportation Services',
    title: 'To store details about transportation providers',
    description:
      'Local Transportation Services(LTS) provide Ride Bookings, Route Planning, and Real-Time Traffic Information.',
    authors: [
      { name: 'Agnes Walker', avatar: '/static/images/avatar/4.jpg' },
      { name: 'Trevor Henderson', avatar: '/static/images/avatar/5.jpg' },
    ],
    link: '/transport', // 跳转路径
  },
];

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

function Author({ authors }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AvatarGroup max={3}>
        {authors.map((author, index) => (
          <Avatar key={index} alt={author.name} src={author.avatar} />
        ))}
      </AvatarGroup>
      <Typography variant="caption">{authors.map((a) => a.name).join(', ')}</Typography>
    </Box>
  );
}

export default function MainContent() {
  const navigate = useNavigate();

  const handleNavigation = (link) => {
    navigate(link);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h1" gutterBottom>
        Tourism
      </Typography>
      <Grid container spacing={2}>
        {cardData.map((card, index) => (
          <Grid item xs={12} md={6} key={index}>
            <StyledCard variant="outlined">
              <CardMedia component="img" image={card.img} alt={card.tag} />
              <StyledCardContent>
                <Typography variant="caption">{card.tag}</Typography>
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="body2">{card.description}</Typography>
                <Button variant="contained" onClick={() => handleNavigation(card.link)}>
                  Learn More
                </Button>
              </StyledCardContent>
              <Author authors={card.authors} />
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}