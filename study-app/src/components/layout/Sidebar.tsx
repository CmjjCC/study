import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  GraduationCap,
  FileUp,
  Target,
  Swords,
  BookX,
  Languages,
  Library,
  FileText,
  Star,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  group: string
  badge?: string
}

const NAV: NavItem[] = [
  { to: '/', label: '学情概览', icon: LayoutDashboard, group: '首页' },
  { to: '/subjects', label: '分科学习', icon: GraduationCap, group: '首页' },

  { to: '/paper-upload', label: '试卷录入', icon: FileUp, group: 'AI 提分闭环' },
  { to: '/weakness', label: '弱点分析报告', icon: Target, group: 'AI 提分闭环' },
  { to: '/training', label: '靶向出题训练', icon: Swords, group: 'AI 提分闭环', badge: 'AI' },

  { to: '/mistakes', label: '错题本', icon: BookX, group: '学习工具' },
  { to: '/vocab', label: '单词记忆', icon: Languages, group: '学习工具' },
  { to: '/materials', label: '素材库', icon: Library, group: '学习工具' },
  { to: '/templates', label: '模板库', icon: FileText, group: '学习工具' },
  { to: '/favorites', label: '收藏', icon: Star, group: '学习工具' },

  { to: '/stats', label: '学习记录', icon: BarChart3, group: '我的' },
  { to: '/settings', label: '设置', icon: Settings, group: '我的' },
]

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const groups = Array.from(new Set(NAV.map((n) => n.group)))

  return (
    <nav className="flex h-full flex-col gap-5 overflow-y-auto px-3 py-4">
      {groups.map((g) => (
        <div key={g}>
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">{g}</p>
          <ul className="space-y-0.5">
            {NAV.filter((n) => n.group === g).map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
                      ${isActive ? 'bg-brand-50 font-semibold text-brand-700' : 'text-sub hover:bg-black/[0.04] hover:text-main'}`
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-md bg-brand-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
