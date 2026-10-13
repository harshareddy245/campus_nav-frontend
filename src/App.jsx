import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatBotDrawer } from './components/ChatBotDrawer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { MapNavigationPage } from './pages/MapNavigationPage';
import { ExplorePage } from './pages/ExplorePage';
import { SavedRoutesPage } from './pages/SavedRoutesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
              <Navbar onOpenChat={() => setIsChatOpen(true)} />

              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Routes>
                  <Route path="/" element={<MapNavigationPage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Student / Faculty Routes */}
                  <Route
                    path="/saved-routes"
                    element={
                      <ProtectedRoute>
                        <SavedRoutesPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="ROLE_ADMIN">
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />

              {/* CampusBot AI Chatbot Drawer */}
              <ChatBotDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          </Router>
        </NavigationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
