import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 桌面侧栏 */}
      <aside className="hidden w-60 shrink-0 border-r bg-[var(--card-bg)] lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <span className="text-sm font-bold">学</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-main">学情闭环</p>
            <p className="text-[11px] text-muted">AI 靶向训练</p>
          </div>
        </div>
        <div className="h-[calc(100vh-4rem)]">
          <Sidebar />
        </div>
      </aside>

      {/* 移动端抽屉 */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r bg-[var(--card-bg)]">
            <div className="flex h-16 items-center gap-2 border-b px-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                <span className="text-sm font-bold">学</span>
              </div>
              <p className="text-sm font-bold text-main">学情闭环</p>
            </div>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* 主区域 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="page fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
