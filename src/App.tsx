import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/routes/LoginPage";
import { RegisterPage } from "@/routes/RegisterPage";
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
import { AcademicianInstitutionAnalyticsPage } from "@/routes/academician/AcademicianInstitutionAnalyticsPage";
import { StudentAssessmentPage } from "@/routes/student/StudentAssessmentPage";
import { StudentPortfolioPage } from "@/routes/student/StudentPortfolioPage";
import { NotificationsPage } from "@/routes/shared/NotificationsPage";
import { LearningProgramsPage } from "@/routes/shared/LearningProgramsPage";
import { CollaborationPage } from "@/routes/shared/CollaborationPage";
import { ProfilePage } from "@/routes/shared/ProfilePage";
import { dashboardPathForRole } from "@/config/nav";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={dashboardPathForRole(user.role_codes[0])} replace />;
}

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
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* Student */}
              <Route path="/student/dashboard" element={<StudentDashboardPage />} />
              <Route path="/student/assessment" element={<StudentAssessmentPage />} />
              <Route path="/student/skills" element={<StudentSkillsPage />} />
              <Route path="/student/opportunities" element={<StudentOpportunitiesPage />} />
              <Route path="/student/applications" element={<StudentApplicationsPage />} />
              <Route
                path="/student/learning"
                element={<LearningProgramsPage title="Learning Programs" subtitle="Close your skill gaps with industry-relevant learning." />}
              />
              <Route path="/student/portfolio" element={<StudentPortfolioPage />} />
              <Route path="/student/profile" element={<ProfilePage title="My Profile" />} />

              {/* Industry */}
              <Route path="/industry/dashboard" element={<IndustryDashboardPage />} />
              <Route path="/industry/post" element={<IndustryPostOpportunityPage />} />
              <Route path="/industry/opportunities" element={<IndustryOpportunitiesPage />} />
              <Route path="/industry/candidates" element={<IndustryCandidatesPage />} />
              <Route path="/industry/applications" element={<IndustryApplicationsPage />} />
              <Route path="/industry/collaboration" element={<CollaborationPage />} />
              <Route path="/industry/profile" element={<ProfilePage title="Company Profile" />} />

              {/* Academician */}
              <Route path="/academician/dashboard" element={<AcademicianDashboardPage />} />
              <Route path="/academician/skill-gap" element={<AcademicianSkillGapPage />} />
              <Route path="/academician/collaboration" element={<CollaborationPage />} />
              <Route path="/academician/institution" element={<AcademicianInstitutionAnalyticsPage />} />
              <Route
                path="/academician/learning"
                element={<LearningProgramsPage title="FDPs & Programs" subtitle="Faculty development programs and industry-led training." />}
              />
              <Route path="/academician/profile" element={<ProfilePage title="My Profile" />} />
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