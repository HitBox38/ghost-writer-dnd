import { notFound } from "next/navigation";
import { SettingsScreen } from "@/components/settings/settings-screen";

export default async function SettingsSection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!["connections", "appearance", "data"].includes(section)) notFound();
  return <SettingsScreen section={section as "connections" | "appearance" | "data"} />;
}
