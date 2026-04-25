import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ContactForm from './ContactForm.tsx';
import ApiDemo from './ApiDemo.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ContactForm />
    <ApiDemo />
  </StrictMode>
)
