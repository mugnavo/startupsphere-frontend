import DashboardComponent from "~/components/dashboard";
import { getAllStartups } from "~/lib/actions/startups";

export default async function DashboardIndex() {
  const startups = await getAllStartups();

  return <DashboardComponent initialStartups={startups} />;
}
