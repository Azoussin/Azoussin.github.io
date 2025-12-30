import { Sidebar } from "@/components/sidebar"

/**
 * Dashboard layout
 * Wraps all authenticated pages with sidebar navigation
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        {children}
      </main>
    </div>
  )
}
