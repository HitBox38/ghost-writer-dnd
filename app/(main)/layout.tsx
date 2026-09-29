import { AppHeader } from "@/components/layout/app-header";
import { Providers } from "@/components/providers";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AppHeader />
      <main id="main-content" className="app-main">
        {children}
      </main>
    </Providers>
  );
}
