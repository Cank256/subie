import { 
  Routes, 
  Route, 
  redirect
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";
import { isLoggedIn }  from '@/hooks/useAuth';
// import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Public routes
import NotFound from "./pages/public/NotFound";
import ContactUs from "./pages/public/ContactUs";
import HelpCenter from "./pages/public/HelpCenter";
import ResponsibleSpending from "./pages/public/ResponsibleSpending";
import Sitemap from "./pages/public/Sitemap";
import Terms from "./pages/public/Terms";
import Privacy from "./pages/public/Privacy";
import Landing from "./pages/public/Landing";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Signup from "./pages/auth/Signup";
import ConfirmEmail from "./pages/auth/ConfirmEmail";
import GoogleCallback from "./pages/auth/GoogleCallback";
import AboutUs from "./pages/public/AboutUs";

// Protected routes
import Index from "./pages/protected/Index";
import Profile from "./pages/protected/Profile";
import Billing from "./pages/protected/Billing";
import Notifications from "./pages/protected/Notifications";
import Preferences from "./pages/protected/Preferences";
import Subscriptions from "./pages/protected/Subscriptions";

// Admin routes
import Users from "./pages/admin/Users";
import Payments from "./pages/admin/Payments";
import Dashboard from "./pages/admin/Dashboard";

async function checkLoggedInStatus() {
  if (isLoggedIn()) {
    throw redirect("/dashboard");
  }
  return null; 
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <AuthProvider> */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/responsible-spending" element={<ResponsibleSpending />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} loader={checkLoggedInStatus} />
          <Route path="/forgot-password" element={<ForgotPassword />} loader={checkLoggedInStatus} />
          <Route path="/reset-password" element={<ResetPassword />} loader={checkLoggedInStatus} />
          <Route path="/signup" element={<Signup />} loader={checkLoggedInStatus} />
          <Route path="/confirm-email/:token" element={<ConfirmEmail />} loader={checkLoggedInStatus} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          {/* PROTECTED ROUTES */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/preferences" element={
            <ProtectedRoute>
              <Preferences />
            </ProtectedRoute>
          } />
          <Route path="/subscriptions" element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          } />
          
          {/* ADMIN ROUTES */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    {/* </AuthProvider> */}
  </QueryClientProvider>
);

export default App;
