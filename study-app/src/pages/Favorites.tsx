import { useState } from 'react'
import { Star, FileText, Library, ClipboardList } from 'lucide-react'
import { Card, Badge, Tag, SubjectIcon, Empty } from '@/components/ui'
import { MATERIALS, QUESTIONS, SUBJECTS } from '@/data/mock'
import type { SubjectKey } from '@/types'

type Tab = '素材' | '模板' | '题目'

interface FavRow {
  id: string
  title: string
  excerpt: string
  subject: SubjectKey
  tags: string[]
  kind: Tab
}

const TPL_FAV: FavRow[] = [
  { id: 'tf1', title: '议论文「并列递进式」结构', excerpt: '引论→分论一→分论二→分论三（递进）→结论。', subject: 'chinese', tags: ['议论文', '结构'], kind: '模板' },
  { id: 'tf2', title: '立体几何建系答题模板', excerpt: '建系→标点→求法向量→代入夹角公式→结论。', subject: 'math', tags: ['立体几何', '建系'], kind: '模板' },
  { id: 'tf3', title: '英语作文「观点+论据」万能段', excerpt: 'Topic + Explanation + Example + Link。', subject: 'english', tags: ['写作', '段落'], kind: '模板' },
]

// 复用现有数据构造收藏列表
const FAV: FavRow[] = [
  ...MATERIALS.slice(0, 3).map((m) => ({ id: m.id, title: m.title, excerpt: m.excerpt, subject: m.subject, tags: m.tags, kind: '素材' as Tab })),
  ...TPL_FAV,
  ...QUESTIONS.slice(0, 2).map((q) => ({ id: q.id, title: q.stem, excerpt: q.analysis, subject: q.subject, tags: q.tags, kind: '题目' as Tab })),
]

const ICON = { 素材: Library, 模板: FileText, 题目: ClipboardList }

export default function Favorites() {
  const [tab, setTab] = useState<Tab | '全部'>('全部')
  const list = FAV.filter((f) => tab === '全部' || f.kind === tab)

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">我的收藏</h1>
          <p className="page-subtitle">收藏的素材、模板与题目集中管理，按类型筛选。</p>
        </div>
      </div>

      {/* 统计 + 筛选 */}
      <div className="flex flex-wrap items-center gap-3">
        {(['全部', '素材', '模板', '题目'] as const).map((t) => {
          const count = t === '全部' ? FAV.length : FAV.filter((f) => f.kind === t).length
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${tab === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'text-sub hover:bg-black/[0.04]'}`}
            >
              {t !== '全部' && (() => { const I = ICON[t]; return <I size={15} /> })()}
              <span>{t}</span>
              <span className="rounded-md bg-black/5 px-1.5 text-xs">{count}</span>
            </button>
          )
        })}
      </div>

      {list.length === 0 ? (
        <Empty title="暂无收藏" desc="在素材库、模板库或刷题中点击收藏即可。">
          <button className="text-sm font-medium text-brand-600 hover:underline" onClick={() => (window.location.hash = '#/materials')}>
            去素材库看看
          </button>
        </Empty>
      ) : (
        <div className="grid-cards">
          {list.map((f) => {
            const sub = SUBJECTS.find((s) => s.key === f.subject)!
            return (
              <Card key={`${f.kind}-${f.id}`} hover className="flex flex-col">
                <div className="flex items-center justify-between">
                  <Badge tone="gray">{f.kind}</Badge>
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                </div>
                <h3 className="mt-2.5 line-clamp-2 text-sm font-semibold text-main">{f.title}</h3>
                <p className="mt-1.5 flex-1 line-clamp-3 text-xs leading-relaxed text-sub">{f.excerpt}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs" style={{ color: sub.color }}>
                    <SubjectIcon subjectKey={f.subject} size={13} /> {sub.name}
                  </span>
                  <div className="flex gap-1">
                    {f.tags.slice(0, 2).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
