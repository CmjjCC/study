import { useState } from 'react'
import { Menu, Moon, Sun, Bell, ChevronDown } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { GRADES } from '@/data/mock'
import { Button } from '@/components/ui'

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const { grade, setGrade, eyeCare, toggleEyeCare } = useApp()
  const [gradeOpen, setGradeOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-[var(--card-bg)] px-4 lg:px-8">
      <button
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-sub hover:bg-black/[0.04] lg:hidden"
        aria-label="菜单"
      >
        <Menu size={20} />
      </button>

      {/* 年级切换 */}
      <div className="relative">
        <button
          onClick={() => setGradeOpen((v) => !v)}
          className="flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium text-main hover:bg-black/[0.03]"
        >
          <span className="text-brand-600">{grade}</span>
          <ChevronDown size={14} className={`transition ${gradeOpen ? 'rotate-180' : ''}`} />
        </button>
        {gradeOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setGradeOpen(false)} />
            <div className="absolute left-0 top-11 z-20 w-28 overflow-hidden rounded-xl border bg-[var(--card-bg)] py-1 shadow-card-hover">
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGrade(g)
                    setGradeOpen(false)
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-brand-50 ${
                    g === grade ? 'font-semibold text-brand-700' : 'text-sub'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="ml-1 hidden text-sm text-muted sm:block">
        欢迎回来，今天也要精准提分 🌱
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* 护眼模式 */}
        <Button
          variant={eyeCare ? 'soft' : 'ghost'}
          size="sm"
          onClick={toggleEyeCare}
          className="h-9"
          title="护眼模式"
        >
          {eyeCare ? <Moon size={16} /> : <Sun size={16} />}
          <span className="hidden md:inline">{eyeCare ? '护眼中' : '护眼'}</span>
        </Button>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-sub hover:bg-black/[0.04]">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <div className="ml-1 flex h-9 items-center gap-2 rounded-lg pl-1 pr-2 hover:bg-black/[0.03]">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            陈
          </div>
          <span className="hidden text-sm font-medium text-main sm:block">陈同学</span>
        </div>
      </div>
    </header>
  )
}
