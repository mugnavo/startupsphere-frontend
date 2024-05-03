import DashboardComponent from "~/components/dashboard";
import { db } from "~/lib/db";

export default async function DashboardIndex() {
  const startups = await db.query.startups.findMany();

  return <DashboardComponent initialStartups={startups} />;
}
