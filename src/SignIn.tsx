import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from './api/axios'; // 修改导入方式

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  padding: 4,
}));

export default function SignIn({ setIsLoggedIn }) { // 接收 setIsLoggedIn
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [alertInfo, setAlertInfo] = React.useState({ show: false, message: '', severity: '' });

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) return;
  
    axios.request({
      url: '/customUser/token/',
      method: 'post',
      data: {
        email: email,
        password: password,
      }
    })
    .then((res) => {
      console.log('登录响应:', res.data);
      const token = res.data?.data?.access;
      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        console.log('登录成功，token:', token);
        setAlertInfo({ show: true, message: '登录成功', severity: 'success' });
        
        // 获取用户信息
        axios.request({
          url: '/customUser/me/',
          method: 'get',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then((userRes) => {
          console.log('用户信息:', userRes.data);
          const userId = res.data?.data?.user_id;
          if (userId) {
            localStorage.setItem('userId', userId.toString());
            console.log('获取到用户ID:', userId);
            setTimeout(() => {
              navigate('/');
            }, 1000);
          } else {
            console.error('未能获取到用户ID', res.data);
            setAlertInfo({ show: true, message: '未能获取到用户ID', severity: 'error' });
          }
        })
        .catch((error) => {
          console.error('获取用户信息错误:', error);
          setAlertInfo({ show: true, message: error.response?.data?.message || '获取用户信息失败', severity: 'error' });
        });
      } else {
        console.error('未能获取到有效的令牌', res.data);
        setAlertInfo({ show: true, message: '登录失败，请检查邮箱和密码', severity: 'error' });
      }
    })
    .catch((error) => {
      console.error('登录错误:', error);
      setAlertInfo({ show: true, message: error.response?.data?.message || '登录失败，请重试', severity: 'error' });
    });
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <CssBaseline />
      <Stack sx={{ justifyContent: 'center', height: '100dvh', p: 2 }}>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Sign in
          </Typography>
          <Button onClick={() => {
            setEmail('user@uow.com');
            setPassword('useruser');
          }}>
            Fill Demo Credentials
          </Button>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailErrorMessage}
              />
            </FormControl>
            <FormControl>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordErrorMessage}
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained">
              Sign In
            </Button>
          </Box>
          {/* 显示提示消息 */}
          {alertInfo.show && (
            <div className={`alert ${alertInfo.severity}`}>{alertInfo.message}</div>
          )}
        </Card>
      </Stack>
    </SignInContainer>
  );
}