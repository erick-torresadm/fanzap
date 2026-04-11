import { Sidebar } from '@/components/layout/Sidebar';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-56 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}