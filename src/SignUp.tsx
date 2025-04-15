import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import axios from './api/axios';
import { useNavigate } from 'react-router-dom';
import {
  createTheme,
  ThemeProvider,
  styled,
  PaletteMode,
} from '@mui/material/styles';
import getSignUpTheme from './theme/getSignUpTheme';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';

// API 调用的函数
const createUser = async (userData) => {
  try {
    const response = await axios.request({
      url: '/customUser/create/',
      method: 'post',
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password
      }
    });
    return response;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  padding: 4,
  backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
}));

export default function SignUp() {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const SignUpTheme = createTheme(getSignUpTheme(mode));
  const [user, setUser] = React.useState({ name: '', email: '', password: '' });
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [alertInfo, setAlertInfo] = React.useState({ show: false, message: '', severity: '' });
  
  const navigate = useNavigate(); // 使用 useNavigate
  
  React.useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode); // Save the selected mode to localStorage
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const name = document.getElementById("name");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }
    return isValid;
  };
  console.log({
    email: user.email,
    password: user.password,
    name: user.name,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const isValid = validateInputs();
    if (!isValid) return;

    createUser({
        name: user.name,
        email: user.email,
        password: user.password,
    })
    .then((res) => {
        if (res.data && res.data.code === 201) {
            setAlertInfo({
                show: true,
                message: "注册成功！请登录",
                severity: "success",
            });
            setTimeout(() => {
                navigate("/sign-in");
            }, 2000);
        } else {
            setAlertInfo({
                show: true,
                message: res.data?.message || "注册失败，请重试",
                severity: "error",
            });
        }
    })
    .catch((error) => {
        console.error('注册错误:', error);
        setAlertInfo({
            show: true,
            message: error.response?.data?.message || "注册失败，请重试",
            severity: "error",
        });
    });
};

  return (
    <ThemeProvider theme={showCustomTheme ? SignUpTheme : defaultTheme}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Stack sx={{ justifyContent: 'center', height: '100dvh', p: 2 }}>
          <Card variant="outlined">
            <SitemarkIcon />
            <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
              Sign up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="Jon Snow"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  error={nameError}
                  helperText={nameErrorMessage}
                  color={nameError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={emailError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive updates via email."
              />
              <Button type="submit" fullWidth variant="contained">
                Sign up
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <span>
                  <Link href="/sign-in" variant="body2" sx={{ alignSelf: 'center' }}>
                    Sign in
                  </Link>
                </span>
              </Typography>
            </Box>
            <Divider>
              <Typography sx={{ color: 'text.secondary' }}>or</Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button type="button" fullWidth variant="outlined" onClick={() => alert('Sign up with Google')} startIcon={<GoogleIcon />}>
                Sign up with Google
              </Button>
              <Button type="button" fullWidth variant="outlined" onClick={() => alert('Sign up with Facebook')} startIcon={<FacebookIcon />}>
                Sign up with Facebook
              </Button>
            </Box>
          </Card>
        </Stack>
      </SignUpContainer>
    </ThemeProvider>
  );
}