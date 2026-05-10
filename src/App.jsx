import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { PhaseProvider } from '@/lib/PhaseContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';
import Timeline from './pages/Timeline';
import EventDetail from './pages/EventDetail';
import Members from './pages/Members';
import SearchPage from './pages/Search';
import AdminLayout from './components/admin/AdminLayout';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventForm from './pages/admin/AdminEventForm';
import AdminPhotos from './pages/admin/AdminPhotos';
import AdminOverviews from './pages/admin/AdminOverviews';
import AdminMembers from './pages/admin/AdminMembers';
import AdminSettings from './pages/admin/AdminSettings';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/members" element={<Members />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminEvents />} />
        <Route path="/admin/events/new" element={<AdminEventForm />} />
        <Route path="/admin/events/:id" element={<AdminEventForm />} />
        <Route path="/admin/photos" element={<AdminPhotos />} />
        <Route path="/admin/overviews" element={<AdminOverviews />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <PhaseProvider>
            <AuthenticatedApp />
          </PhaseProvider>
        <