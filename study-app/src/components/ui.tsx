import type { ReactNode, ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Priority, WeaknessType, SubjectKey } from '@/types'
import {
  BookOpen,
  Sigma,
  Languages,
  Atom,
  FlaskConical,
  Leaf,
  Scroll,
  Globe2,
  Scale,
  HelpCircle,
} from 'lucide-react'

// ====== Button ======
type BtnVariant = 'primary' | 'outline' | 'ghost' | 'soft' | 'danger'
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
}
const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap'
const btnVariants: Record<BtnVariant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm',
  outline: 'border border-brand-500 text-brand-600 hover:bg-brand-50',
  ghost: 'text-sub hover:bg-black/5',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100',
}
const btnSizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' }

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: BtnProps) {
  return (
    <button className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

// ====== Card ======
export function Card({
  children,
  className = '',
  hover = false,
  pad = 'md',
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  pad?: 'sm' | 'md' | 'lg' | 'none'
}) {
  const padCls = { sm: 'p-4', md: 'p-6', lg: 'p-8', none: '' }[pad]
  return <div className={`card ${padCls} ${hover ? 'card-hover' : ''} ${className}`}>{children}</div>
}

// ====== Section 标题 ======
export function SectionTitle({
  title,
  subtitle,
  right,
  className = '',
  children,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={`mb-4 flex items-end justify-between gap-3 ${className}`}>
      <div>
        <h3 className="text-base font-semibold text-main">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-sub">{subtitle}</p>}
      </div>
      {right ?? children}
    </div>
  )
}

// ====== Badge / Tag ======
const badgeTones: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-600',
  green: 'bg-brand-100 text-brand-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-700',
}
export function Badge({
  children,
  tone = 'gray',
  className = '',
}: {
  children: ReactNode
  tone?: keyof typeof badgeTones
  className?: string
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeTones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-sub border">{children}</span>
}

// ====== Priority 优先级徽标 ======
export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { tone: keyof typeof badgeTones; label: string }> = {
    高: { tone: 'red', label: '高优先级' },
    中: { tone: 'amber', label: '中优先级' },
    低: { tone: 'gray', label: '低优先级' },
  }
  const it = map[priority]
  return <Badge tone={it.tone}>{it.label}</Badge>
}

// ====== 弱点类型徽标 ======
export function WeaknessTypeBadge({ type }: { type: WeaknessType }) {
  const map: Record<WeaknessType, keyof typeof badgeTones> = {
    基础漏洞: 'red',
    题型短板: 'amber',
    解题思路缺陷: 'purple',
    应试易错误区: 'blue',
  }
  return <Badge tone={map[type]}>{type}</Badge>
}

// ====== Progress 进度条 ======
export function Progress({
  value,
  tone = '#33a566',
  className = '',
  showLabel = false,
  height = 'h-2',
}: {
  value: number
  tone?: string
  className?: string
  showLabel?: boolean
  height?: string
}) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 rounded-full bg-gray-100 ${height} overflow-hidden`}>
        <div className={`h-full rounded-full transition-all`} style={{ width: `${v}%`, backgroundColor: tone }} />
      </div>
      {showLabel && <span className="w-10 text-right text-xs font-medium text-sub">{v}%</span>}
    </div>
  )
}

// ====== Difficulty 难度星级 ======
export function Difficulty({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={`难度 ${level}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`inline-block h-1.5 w-1.5 rounded-full ${i < level ? 'bg-amber-400' : 'bg-gray-200'}`}
        />
      ))}
    </span>
  )
}

// ====== 统计 Tile ======
export function StatTile({
  label,
  value,
  unit,
  hint,
  icon,
  tone = '#33a566',
}: {
  label: string
  value: string | number
  unit?: string
  hint?: string
  icon?: ReactNode
  tone?: string
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-sub">{label}</span>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${tone}1a`, color: tone }}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-bold tracking-tight text-main">{value}</span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

// ====== 学科图标映射（用于按 key 渲染 lucide 图标）======
const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Sigma,
  Languages,
  Atom,
  FlaskConical,
  Leaf,
  Scroll,
  Globe2,
  Scale,
}

export function SubjectIcon({
  subjectKey,
  size = 20,
  className = '',
}: {
  subjectKey: SubjectKey
  size?: number
  className?: string
}) {
  const names: Record<SubjectKey, string> = {
    chinese: 'BookOpen',
    math: 'Sigma',
    english: 'Languages',
    physics: 'Atom',
    chemistry: 'FlaskConical',
    biology: 'Leaf',
    history: 'Scroll',
    geography: 'Globe2',
    politics: 'Scale',
  }
  const Comp = ICON_MAP[names[subjectKey]] ?? HelpCircle
  return <Comp size={size} className={className} />
}

// ====== 空状态 ======
export function Empty({ title, desc, action, children }: { title: string; desc?: string; action?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-muted">
        <HelpCircle size={22} />
      </div>
      <p className="mt-3 text-sm font-medium text-main">{title}</p>
      {desc && <p className="mt-1 max-w-xs text-xs text-muted">{desc}</p>}
      {(action ?? children) && <div className="mt-4">{action ?? children}</div>}
    </div>
  )
}
