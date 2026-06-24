import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCard from "../components/dashboard/StatCard";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import RecentProjects from "../components/dashboard/RecentProjects";
import SystemStatus from "../components/dashboard/SystemStatus";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <WelcomeBanner />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Projects"
            value="12"
            description="Projects currently managed by CodeSage"
          />

          <StatCard
            title="AI Reviews"
            value="154"
            description="Total reviews generated"
          />

          <StatCard
            title="Documentation"
            value="48"
            description="Generated documentation files"
          />

          <StatCard
            title="Quality Score"
            value="92%"
            description="Average project quality score"
          />
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActivityFeed />
          <RecentProjects />
        </div>

        <SystemStatus />
      </div>
    </div>
  );
}