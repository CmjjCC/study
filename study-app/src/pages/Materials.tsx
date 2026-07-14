import { useState } from 'react'
import { Library, Star, Copy, Search } from 'lucide-react'
import { Card, Button, Badge, Tag, SubjectIcon, Empty } from '@/components/ui'
import { MATERIALS, SUBJECTS } from '@/data/mock'

export default function Materials() {
  const cats = ['全部', ...Array.from(new Set(MATERIALS.map((m) => m.category)))]
  const [cat, setCat] = useState('全部')
  const [starred, setStarred] = useState<Set<string>>(new Set())

  const list = MATERIALS.filter((m) => cat === '全部' || m.category === cat)

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">素材库</h1>
          <p className="page-subtitle">议论文素材、写作句式、人物事迹，写作随时取用。</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input-base h-10 pl-9 sm:w-64" placeholder="搜索素材…" />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${cat === c ? 'bg-brand-500 text-white' : 'bg-gray-50 text-sub hover:bg-gray-100'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty title="暂无素材" />
      ) : (
        <div className="grid-cards">
          {list.map((m) => {
            const sub = SUBJECTS.find((s) => s.key === m.subject)!
            const isStar = starred.has(m.id)
            return (
              <Card key={m.id} hover className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-sub">
                    <SubjectIcon subjectKey={m.subject} size={14} />
                    <span style={{ color: sub.color }}>{sub.name}</span> · {m.category}
                  </span>
                  <button
                    onClick={() =>
                      setStarred((s) => {
                        const n = new Set(s)
                        n.has(m.id) ? n.delete(m.id) : n.add(m.id)
                        return n
                      })
                    }
                    className="text-muted hover:text-amber-400"
                  >
                    <Star size={16} className={isStar ? 'fill-amber-400 text-amber-400' : ''} />
                  </button>
                </div>
                <h3 className="mt-2 text-base font-semibold text-main">{m.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-sub line-clamp-3">{m.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 border-t pt-3">
                  <Button variant="ghost" size="sm" className="flex-1"><Copy size={14} /> 复制</Button>
                  <Button variant="outline" size="sm" className="flex-1"><Star size={14} /> 收藏</Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
