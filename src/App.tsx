import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Contact from "@/pages/Contact";
import Pricing from "./pages/Pricing";
import ContactSalesPage from "./pages/ContactSales";
import Login from "./pages/Login";
import SignupPage from "./pages/SignUp";
import "./components/firebase";
import { ProtectedDashboardWrapper } from "./pages/ProtectedRoute";
import Home from "./pages/home";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function Router() {
  return (
    <Switch>
      {/* 🔥 SAME URL Public and Protected */}
      <ProtectedDashboardWrapper
        path="/"
        component={Home}
        componentLogedIn={Dashboard}
      />
      {/* 🔐 Protected */}

      {/* 🌐 Public */}
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/contact" component={Contact} />
      <Route path="/contact-sales" component={ContactSalesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
