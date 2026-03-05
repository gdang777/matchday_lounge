import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import HubPage from './pages/HubPage';
import HappyHourPage from './pages/HappyHourPage';
import RestaurantPage from './pages/RestaurantPage';
import MapPage from './pages/MapPage';
import EmergencyPage from './pages/EmergencyPage';
import LanguagePage from './pages/LanguagePage';
import ConciergePage from './pages/ConciergePage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<HubPage />} />
                    <Route path="/happy-hour" element={<HappyHourPage />} />
                    <Route path="/happy-hour/:id" element={<RestaurantPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/emergency" element={<EmergencyPage />} />
                    <Route path="/language" element={<LanguagePage />} />
                    <Route path="/concierge" element={<ProtectedRoute><ConciergePage /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
