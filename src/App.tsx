/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Booking } from './pages/Booking';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Admin } from './admin/Admin';
import { AdminLogin } from './admin/Login';
import { AuthGuard } from './admin/AuthGuard';
import { BookingProvider } from './BookingContext';

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BookingProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/services" element={<Layout><Services /></Layout>} />
              <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/booking" element={<Layout><Booking /></Layout>} />
              <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
              <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
              <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
              <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AuthGuard />}>
                <Route index element={<Admin />} />
                <Route path="*" element={<Admin />} />
              </Route>
            </Routes>
          </Router>
        </BookingProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
