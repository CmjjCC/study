import { useState } from 'react'
import { BookX, RotateCcw, Archive, Filter } from 'lucide-react'
import { Card, Button, Badge, WeaknessTypeBadge, Difficulty, SubjectIcon, Empty } from '@/components/ui'
import { MISTAKES, SUBJECTS } from '@/data/mock'
import type { SubjectKey, WeaknessType } from '@/types'

const TYPES: (WeaknessType | '全部')[] = ['全部', '基础漏洞', '题型短板', '解题思路缺陷', '应试易错误区']

export default function MistakeBook() {
  const [subject, setSubject] = useState<SubjectKey | 'all'>('all')
  const [type, setType] = useState<WeaknessType | '全部'>('全部')
  const [onlyUnreviewed, setOnlyUnreviewed] = useState(false)

  const list = MISTAKES.filter((m) => {
    if (subject !== 'all' && m.question.subject !== subject) return false
    if (type !== '全部' && m.type !== type) return false
    if (onlyUnreviewed && m.reviewed) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">错题本</h1>
          <p className="page-subtitle">失分题自动收录，按学科 / 类型筛选，支持重做与归档。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Archive size={14} /> 归档已掌握</Button>
        </div>
      </div>

      {/* 筛选条 */}
      <Card pad="sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted" />
            <span className="text-xs text-sub">学科</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={subject === 'all'} onClick={() => setSubject('all')}>全部</FilterChip>
            {SUBJECTS.filter((s) => s.enabled).map((s) => (
              <FilterChip key={s.key} active={subject === s.key} onClick={() => setSubject(s.key)}>
                {s.name}
              </FilterChip>
            ))}
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <FilterChip key={t} active={type === t} onClick={() => setType(t)}>{t}</FilterChip>
            ))}
          </div>
          <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-sm text-sub">
            <input type="checkbox" checked={onlyUnreviewed} onChange={(e) => setOnlyUnreviewed(e.target.checked)} className="accent-brand-500" />
            仅看未复习
          </label>
        </div>
      </Card>

      {list.length === 0 ? (
        <Empty title="没有符合条件的错题" desc="调整筛选条件，或录入新试卷产生错题。" />
      ) : (
        <div className="space-y-4">
          {list.map((m) => {
            const sub = SUBJECTS.find((s) => s.key === m.question.subject)!
            return (
              <Card key={m.id} hover className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${sub.color}1a`, color: sub.color }}>
                      <SubjectIcon subjectKey={m.question.subject} size={18} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Badge tone="gray">{sub.name}</Badge>
                        <Badge tone="gray">{m.question.type}</Badge>
                        <Difficulty level={m.question.difficulty} />
                        <span className="text-muted">· 收录于 {m.addedAt}</span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-main">{m.question.stem}</p>
                    </div>
                  </div>
                  {m.reviewed && <Badge tone="green">已复习</Badge>}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-red-50/50 p-3">
                    <p className="mb-1 text-xs font-medium text-red-600">我的作答</p>
                    <p className="text-sm text-main">{m.wrongAnswer}</p>
                  </div>
                  <div className="rounded-xl bg-brand-50/50 p-3">
                    <p className="mb-1 text-xs font-medium text-brand-700">正确答案</p>
                    <p className="text-sm text-main">{m.question.answer}</p>
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <WeaknessTypeBadge type={m.type} />
                    <span className="text-xs text-muted">错因分析</span>
                  </div>
                  <p className="text-sm text-sub">{m.reason}</p>
                </div>

                <div className="flex justify-end gap-2 border-t pt-3">
                  <Button variant="ghost" size="sm"><Archive size={14} /> 归档</Button>
                  <Button variant="outline" size="sm"><RotateCcw size={14} /> 重做</Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1 text-xs transition ${active ? 'bg-brand-500 text-white' : 'bg-gray-50 text-sub hover:bg-gray-100'}`}
    >
      {children}
    </button>
  )
}
