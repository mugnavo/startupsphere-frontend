import DashboardComponent from "~/components/Dashboard";
import { getAllStartups } from "~/lib/actions/startups";

export default async function DashboardIndex() {
  const startups = await getAllStartups();

  return <DashboardComponent initialStartups={startups} />;
}
