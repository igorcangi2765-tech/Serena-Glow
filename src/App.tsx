/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { Layout } from './Layout';
import { Home } from './Home';
import { About } from './About';
import { Services } from './Services';
import { Gallery } from './Gallery';
import { Contact } from './Contact';
import { Booking } from './Booking';
import { Admin } from './Admin';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></HomeLayout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/booking" element={<Layout><Booking /></Layout>} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
