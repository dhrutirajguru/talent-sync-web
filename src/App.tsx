import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/routes/LoginPage";
import { RegisterPage } from "@/routes/RegisterPage";
import { DashboardStub } from "@/routes/DashboardStub";
import { Placeholder } from "@/routes/Placeholder";
import { StudentDashboardPage } from "@/routes/student/StudentDashboardPage";
import { StudentSkillsPage } from "@/routes/student/StudentSkillsPage";
import { StudentOpportunitiesPage } from "@/routes/student/StudentOpportunitiesPage";
import { StudentApplicationsPage } from "@/routes/student/StudentApplicationsPage";
import { IndustryDashboardPage } from "@/routes/industry/IndustryDashboardPage";
import { IndustryPostOpportunityPage } from "@/routes/industry/IndustryPostOpportunityPage";
import { IndustryOpportunitiesPage } from "@/routes/industry/IndustryOpportunitiesPage";
import { IndustryCandidatesPage } from "@/routes/industry/IndustryCandidatesPage";
import { IndustryApplicationsPage } from "@/routes/industry/IndustryApplicationsPage";
import { AcademicianDashboardPage } from "@/routes/academician/AcademicianDashboardPage";
import { AcademicianSkillGapPage } from "@/routes/academician/AcademicianSkillGapPage";
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
        <ToastProvider>
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

              <Route path="/student/dashboard" element={<StudentDashboardPage />} />
              <Route path="/student/skills" element={<StudentSkillsPage />} />
              <Route path="/student/opportunities" element={<StudentOpportunitiesPage />} />
              <Route path="/student/applications" element={<StudentApplicationsPage />} />

              <Route path="/industry/dashboard" element={<IndustryDashboardPage />} />
              <Route path="/industry/post" element={<IndustryPostOpportunityPage />} />
              <Route path="/industry/opportunities" element={<IndustryOpportunitiesPage />} />
              <Route path="/industry/candidates" element={<IndustryCandidatesPage />} />
              <Route path="/industry/applications" element={<IndustryApplicationsPage />} />

              <Route path="/academician/dashboard" element={<AcademicianDashboardPage />} />
              <Route path="/academician/skill-gap" element={<AcademicianSkillGapPage />} />

              {Object.entries(NAV_BY_ROLE).flatMap(([role, items]) =>
                items
                  .filter((item) => {
                    const realPaths = [
                      "/student/dashboard", "/student/skills", "/student/opportunities", "/student/applications",
                      "/industry/dashboard", "/industry/post", "/industry/opportunities", "/industry/candidates", "/industry/applications",
                      "/academician/dashboard", "/academician/skill-gap",
                    ];
                    return !realPaths.includes(item.path);
                  })
                  .map((item) => (
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
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;