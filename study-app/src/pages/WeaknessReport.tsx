import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Target, AlertTriangle, Lightbulb, Swords, TrendingDown } from 'lucide-react'
import { Card, Badge, Progress, PriorityBadge, WeaknessTypeBadge, Button, SectionTitle, SubjectIcon, Empty } from '@/components/ui'
import { WEAKNESSES, SUBJECTS } from '@/data/mock'
import { useApp } from '@/context/AppContext'
import type { WeaknessType } from '@/types'

const TYPES: WeaknessType[] = ['基础漏洞', '题型短板', '解题思路缺陷', '应试易错误区']
const TYPE_TONE: Record<WeaknessType, string> = {
  基础漏洞: '#ef4444',
  题型短板: '#f59e0b',
  解题思路缺陷: '#a855f7',
  应试易错误区: '#3b82f6',
}

export default function WeaknessReport() {
  const { activeSubject, setActiveSubject } = useApp()
  const enabled = SUBJECTS.filter((s) => s.enabled)

  const filtered = useMemo(() => {
    const list = activeSubject ? WEAKNESSES.filter((w) => w.subject === activeSubject) : WEAKNESSES
    return [...list].sort((a, b) => {
      const pr = { 高: 0, 中: 1, 低: 2 }
      return pr[a.priority] - pr[b.priority]
    })
  }, [activeSubject])

  const counts = TYPES.map((t) => ({ type: t, count: filtered.filter((w) => w.type === t).length }))

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">弱点分析报告</h1>
          <p className="page-subtitle">AI 按四类问题精准归因，标注学习优先级，给出可落地提升方案。</p>
        </div>
        <Link to="/training">
          <Button><Swords size={16} /> 靶向训练</Button>
        </Link>
      </div>

      {/* 四类归因概览 */}
      <div className="grid-cards-4">
        {counts.map((c) => (
          <Card key={c.type} pad="md">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${TYPE_TONE[c.type]}1a`, color: TYPE_TONE[c.type] }}>
                {c.type === '基础漏洞' ? <AlertTriangle size={16} /> : c.type === '应试易错误区' ? <Target size={16} /> : <Lightbulb size={16} />}
              </span>
              <span className="text-2xl font-bold text-main">{c.count}</span>
            </div>
            <p className="mt-2 text-xs text-sub">{c.type}</p>
          </Card>
        ))}
      </div>

      {/* 学科筛选 */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSubject(null)}
          className={`rounded-lg border px-3 py-1.5 text-sm transition ${activeSubject === null ? 'border-brand-500 bg-brand-50 text-brand-700' : 'text-sub hover:bg-black/[0.04]'}`}
        >
          全部
        </button>
        {enabled.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSubject(s.key)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition ${activeSubject === s.key ? 'border-brand-500 bg-brand-50 text-brand-700' : 'text-sub hover:bg-black/[0.04]'}`}
          >
            <SubjectIcon subjectKey={s.key} size={14} />
            {s.name}
          </button>
        ))}
      </div>

      {/* 弱点列表 */}
      {filtered.length === 0 ? (
        <Empty title="暂无弱点" desc="录入试卷后，AI 将自动诊断并生成弱点档案。" />
      ) : (
        <div className="space-y-4">
          {filtered.map((w) => {
            const sub = SUBJECTS.find((s) => s.key === w.subject)!
            return (
              <Card key={w.id} hover className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${sub.color}1a`, color: sub.color }}>
                      <SubjectIcon subjectKey={w.subject} size={18} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-main">{w.knowledge}</h3>
                        <PriorityBadge priority={w.priority} />
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <Badge tone="gray">{sub.name}</Badge>
                        <WeaknessTypeBadge type={w.type} />
                      </div>
                    </div>
                  </div>
                  <Link to="/training">
                    <Button variant="outline" size="sm">
                      <Swords size={14} /> 靶向训练
                    </Button>
                  </Link>
                </div>

                {/* 双进度：掌握度 + 失分率 */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-sub">当前掌握度</span>
                      <span className="font-semibold text-main">{w.mastery}%</span>
                    </div>
                    <Progress value={w.mastery} tone={sub.color} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-sub">
                        <TrendingDown size={12} /> 失分率
                      </span>
                      <span className="font-semibold" style={{ color: TYPE_TONE[w.type] }}>{w.loseRate}%</span>
                    </div>
                    <Progress value={w.loseRate} tone={TYPE_TONE[w.type]} />
                  </div>
                </div>

                {/* 提升方案 */}
                <div className="rounded-xl bg-brand-50/60 p-4">
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                    <Lightbulb size={14} /> 可落地提升方案
                  </p>
                  <p className="text-sm leading-relaxed text-main">{w.suggestion}</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
