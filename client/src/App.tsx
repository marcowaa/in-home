import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SupportButton } from "@/components/SupportButton";

import NotFound from "@/pages/not-found";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminPaymentMethods from "@/pages/admin/AdminPaymentMethods";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminChangePassword from "@/pages/admin/AdminChangePassword";
import AdminDrivers from "@/pages/admin/AdminDrivers";
import AdminIntegrations from "@/pages/admin/AdminIntegrations";
import AdminOperationsLog from "@/pages/admin/AdminOperationsLog";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import DriverLogin from "@/pages/driver/DriverLogin";
import DriverDashboard from "@/pages/driver/DriverDashboard";
import DriverWallet from "@/pages/driver/DriverWallet";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/admin" />
      </Route>

      <Route path="/driver" component={DriverLogin} />
      <Route path="/driver/dashboard" component={DriverDashboard} />
      <Route path="/driver/wallet" component={DriverWallet} />

      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/drivers" component={AdminDrivers} />
      <Route path="/admin/payment-methods" component={AdminPaymentMethods} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/integrations" component={AdminIntegrations} />
      <Route path="/admin/operations-log" component={AdminOperationsLog} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route path="/admin/change-password" component={AdminChangePassword} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          <Router />
          <SupportButton />
          <Toaster />
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
