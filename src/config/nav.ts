export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

/**
 * Note: the original prototype had a 4th "institution" role with its own
 * dashboard/analytics screens. Since no separate Institution Admin login
 * flow is seeded/agreed for the demo (Section 6.1 scope — only Student,
 * Academician, Industry are real logins), those two mockup screens
 * (Institution Dashboard, Institution Analytics & Reports) are folded in
 * as mock sub-pages under the Academician's nav instead of a 4th role.
 */
export const NAV_BY_ROLE: Record<string, NavItem[]> = {
  STUDENT: [
    { path: "/student/dashboard", label: "Dashboard", icon: "▣" },
    { path: "/student/assessment", label: "Skill Assessment", icon: "☑" },
    { path: "/student/skills", label: "Skill Mapping", icon: "◉" },
    { path: "/student/opportunities", label: "Internships & Jobs", icon: "▤" },
    { path: "/student/applications", label: "My Applications", icon: "✓" },
    { path: "/student/learning", label: "Learning Programs", icon: "▧" },
    { path: "/student/portfolio", label: "Digital Portfolio", icon: "▣" },
    { path: "/student/profile", label: "Profile", icon: "●" },
  ],
  ACADEMICIAN: [
    { path: "/academician/dashboard", label: "Dashboard", icon: "▣" },
    { path: "/academician/skill-gap", label: "Skill Gap Report", icon: "☷" },
    { path: "/academician/collaboration", label: "Industry Collaboration", icon: "↔" },
    { path: "/academician/institution", label: "Institution Analytics", icon: "◔" },
    { path: "/academician/learning", label: "FDPs & Programs", icon: "▧" },
    { path: "/academician/profile", label: "My Profile", icon: "▣" },
  ],
  INDUSTRY: [
    { path: "/industry/dashboard", label: "Dashboard", icon: "▣" },
    { path: "/industry/post", label: "Post Opportunity", icon: "＋" },
    { path: "/industry/opportunities", label: "My Opportunities", icon: "▤" },
    { path: "/industry/candidates", label: "Skill-Matched Candidates", icon: "◉" },
    { path: "/industry/applications", label: "Applications", icon: "✓" },
    { path: "/industry/collaboration", label: "Collaboration", icon: "↔" },
    { path: "/industry/profile", label: "Company Profile", icon: "▣" },
  ],
};

export function dashboardPathForRole(role: string): string {
  switch (role) {
    case "STUDENT":
      return "/student/dashboard";
    case "ACADEMICIAN":
      return "/academician/dashboard";
    case "INDUSTRY":
      return "/industry/dashboard";
    default:
      return "/login";
  }
}
