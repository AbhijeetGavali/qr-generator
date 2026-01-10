import { Route } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return <Route {...rest} component={Component} />;
}

export function ProtectedDashboardWrapper({
  component: Component,
  componentLogedIn: ComponentLogedIn,
  ...rest
}: any) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return user ? (
    <Route {...rest} component={ComponentLogedIn} />
  ) : (
    <Route {...rest} component={Component} />
  );
}
