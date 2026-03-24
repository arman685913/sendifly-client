import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import router from './router.jsx';
import AuthProvider from './Firebase/AuthProvider.jsx';

import "leaflet/dist/leaflet.css";
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({
  duration: 1000,
  offset: 300,
  once: true,
  delay: 700,
})
import Swiper from 'swiper';
import 'swiper/css';

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer></ToastContainer>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
