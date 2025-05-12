type PointsByCategory = {
  "🏆 FREE User Points": number;
  "Daily app open": number;
  "Create grocery list": number;
  "Download recipe": number;
  "Add to favorites": number;
  "Save to cookbook": number;
  "Complete a meal plan": number;
  "Log cooked meal": number;
  "Rate recipe": number;
  "Refer a friend": number;
  "Subscribe to Pro (Yearly)": number;
  "Upgrade to Pro": number;
};

type RecentActivity = {
  id: number;
  user_email: string;
  points: number;
  reason: string;
  reason_display: string;
  earned_at: string; // ISO date string
};

export type UserPointsData = {
  total_points: number;
  points_by_category: PointsByCategory;
  streak_days: number;
  is_pro_user: boolean;
  recent_activity: RecentActivity[];
};
