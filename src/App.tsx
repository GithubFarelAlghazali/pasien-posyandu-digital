/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { UserProvider } from './context/UserContext';
import AdultDashboardPage from './components/pages/AdultDashboardPage';
import OnboardingPage from './components/pages/OnboardingPage';
import HomePage from './components/pages/HomePage';
import ProfilePage from './components/pages/ProfilePage';
import StoryPage from './components/pages/StoryPage';
import QuizPage from './components/pages/QuizPage';
import SchedulePage from './components/pages/SchedulePage';
import EducationPage from './components/pages/EducationPage';
import HistoryPage from './components/pages/HistoryPage';
import FeedbackPage from './components/pages/FeedbackPage';
import MobileLayout from './components/templates/MobileLayout';

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Adult Pasien Dashboard as the root page */}
        <Route path="/" element={<MobileLayout><AdultDashboardPage /></MobileLayout>} />
        
        {/* Other Adult Pages */}
        <Route path="/schedule" element={<MobileLayout><SchedulePage /></MobileLayout>} />
        <Route path="/history" element={<MobileLayout><HistoryPage /></MobileLayout>} />
        <Route path="/education" element={<MobileLayout><EducationPage /></MobileLayout>} />
        <Route path="/feedback" element={<MobileLayout><FeedbackPage /></MobileLayout>} />

        {/* Kids Gamification Flow */}
        <Route path="/kids-adventure" element={<MobileLayout><HomePage /></MobileLayout>} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/story" element={<MobileLayout><StoryPage /></MobileLayout>} />
        <Route path="/quiz" element={<MobileLayout><QuizPage /></MobileLayout>} />
        <Route path="/profile" element={<MobileLayout><ProfilePage /></MobileLayout>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

