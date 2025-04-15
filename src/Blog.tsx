import * as React from 'react';
import { Link } from 'react-router-dom';  // 导入 Link 组件
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppAppBar from './components/AppAppBar';
import MainContent from './components/MainContent';
import Latest from './components/Latest';
import Footer from './components/Footer';


export default function Blog() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <AppAppBar/>
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <MainContent/>
        
        
      </Container>
      <Footer />
    </>
  );
}