import { notFound } from "next/navigation";
import { SettingsScreen } from "@/components/settings/settings-screen";
const SettingsSection = async ({
  params,
}: {
  params: Promise<{
    section: string;
  }>;
}) => {
  const { section } = await params;
  if (!["connections", "appearance", "data"].includes(section)) notFound();
  return <SettingsScreen section={section as "connections" | "appearance" | "data"} />;
};
export default SettingsSection;
