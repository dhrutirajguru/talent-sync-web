import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/routes/LoginPage";
import { RegisterPage } from "@/routes/RegisterPage";
import { DashboardStub } from "@/routes/DashboardStub";
import { Placeholder } from "@/routes/Placeholder";
import { NAV_BY_ROLE, dashboardPathForRole } from "@/config/nav";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={dashboardPathForRole(user.role_codes[0])} replace />;
}

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "B.Tech Student",
  ACADEMICIAN: "Academician",
  INDUSTRY: "Industry Partner",
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/notifications" element={<Placeholder title="Notifications" />} />

            {Object.entries(NAV_BY_ROLE).flatMap(([role, items]) =>
              items.map((item) => (
                <Route
                  key={item.path}
                  path={item.path}
                  element={
                    item.path.endsWith("/dashboard") ? (
                      <DashboardStub roleLabel={ROLE_LABELS[role]} />
                    ) : (
                      <Placeholder title={item.label} />
                    )
                  }
                />
              ))
            )}
          </Route>

          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
