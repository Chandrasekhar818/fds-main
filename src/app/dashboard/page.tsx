

import { SmartMoneyDashboard } from '@/components/dashboard/SmartMoneyDashboard';

export const metadata = {
  title: 'Smart Money Analytics | Dashboard',
  description: 'Insider · Institutional · COT · Price — combined signal dashboard',
};

export default async function DashboardPage() {
  return <SmartMoneyDashboard />;
}