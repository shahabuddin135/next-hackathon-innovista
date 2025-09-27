import { Header } from "@/components/Header"
import { I18nProvider } from "@/lib/i18n"

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50 relative">
      {/* Grain texture overlay */}
      <div className="fixed inset-0 opacity-25 dark:opacity-15 pointer-events-none grain-texture" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <I18nProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </I18nProvider>
      </div>
    </div>
  )
}