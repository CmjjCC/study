import { useState } from 'react'
import { Star, Copy, Search } from 'lucide-react'
import { Card, Button, Badge, Tag, SubjectIcon, Empty } from '@/components/ui'
import { MATERIALS, SUBJECTS } from '@/data/mock'
import { useApp } from '@/context/AppContext'
import { useData } from '@/context/DataContext'
import type { SubjectKey } from '@/types'

export default function Materials() {
  const { grade } = useApp()
  const { toggleFavorite, isFavorite } = useData()
  const enabled = SUBJECTS.filter((s) => s.enabled)
  const [subject, setSubject] = useState<SubjectKey>(enabled[0].key)
  const [query, setQuery] = useState('')

  const sub = SUBJECTS.find((s) => s.key === subject)!
  const list = MATERIALS.filter((m) => m.subject === subject && m.grade === grade)
    .filter((m) => !query || m.title.includes(query) || m.excerpt.includes(query) || m.tags.some((t) => t.includes(query)))

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">素材库</h1>
          <p className="page-subtitle">按学科分类，随年级更换 · 当前年级：{grade}</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input-base h-10 pl-9 sm:w-56"
            placeholder="搜索当前学科素材…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 学科分类（无「全部」，按学科切换） */}
      <div className="flex flex-wrap gap-1.5">
        {enabled.map((s) => (
          <button
            key={s.key}
            onClick={() => setSubject(s.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${subject === s.key ? 'bg-brand-500 text-white' : 'bg-gray-50 text-sub hover:bg-gray-100'}`}
          >
            <SubjectIcon subjectKey={s.key} size={14} />
            {s.name}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty title={`「${grade}」${sub.name}暂无素材`} desc="切换年级或学科查看其他素材内容。" />
      ) : (
        <div className="grid-cards">
          {list.map((m) => {
            const isStar = isFavorite('素材', m.id)
            return (
              <Card key={m.id} hover className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-sub">
                    <span style={{ color: sub.color }}>{sub.name}</span> · {m.category}
                  </span>
                  <button
                    onClick={() =>
                      toggleFavorite({ id: `mat-${m.id}`, kind: '素材', refId: m.id, title: m.title, excerpt: m.excerpt, subject: m.subject, tags: m.tags })
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
                  <Button
                    variant={isStar ? 'soft' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      toggleFavorite({ id: `mat-${m.id}`, kind: '素材', refId: m.id, title: m.title, excerpt: m.excerpt, subject: m.subject, tags: m.tags })
                    }
                  >
                    <Star size={14} /> {isStar ? '已收藏' : '收藏'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
