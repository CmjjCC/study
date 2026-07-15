import { useState } from 'react'
import { Copy, Star, ChevronRight } from 'lucide-react'
import { Card, Button, Badge, Tag, SubjectIcon, Empty } from '@/components/ui'
import { TEMPLATES, SUBJECTS } from '@/data/mock'
import { useApp } from '@/context/AppContext'
import { useData } from '@/context/DataContext'
import type { SubjectKey } from '@/types'

export default function Templates() {
  const { grade } = useApp()
  const { toggleFavorite, isFavorite } = useData()
  const enabled = SUBJECTS.filter((s) => s.enabled)
  const [subject, setSubject] = useState<SubjectKey>(enabled[0].key)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const sub = SUBJECTS.find((s) => s.key === subject)!
  const list = TEMPLATES.filter((t) => t.subject === subject && t.grade === grade)

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">模板库</h1>
          <p className="page-subtitle">作文模板、解题套路、答题规范，按学科分类随年级更换 · 当前年级：{grade}</p>
        </div>
      </div>

      {/* 学科分类（无「全部」） */}
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
        <Empty title={`「${grade}」${sub.name}暂无模板`} desc="切换年级或学科查看其他模板内容。" />
      ) : (
        <div className="grid-cards">
          {list.map((t) => {
            const isOpen = expanded.has(t.id)
            const isStar = isFavorite('模板', t.id)
            const fav = () =>
              toggleFavorite({ id: `tpl-${t.id}`, kind: '模板', refId: t.id, title: t.title, excerpt: t.body, subject: t.subject, tags: t.tags })
            return (
              <Card key={t.id} hover className="flex flex-col">
                <div className="flex items-center justify-between">
                  <Badge tone="gray">{t.category}</Badge>
                  <button onClick={fav} className="text-muted hover:text-amber-400">
                    <Star size={16} className={isStar ? 'fill-amber-400 text-amber-400' : ''} />
                  </button>
                </div>
                <h3 className="mt-3 text-base font-semibold text-main">{t.title}</h3>
                <p className="mt-1 text-xs text-muted">{t.use}</p>
                <div className={`mt-3 rounded-lg bg-gray-50/60 p-3 text-sm leading-relaxed text-sub ${isOpen ? '' : 'line-clamp-2'}`}>
                  {t.body}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.map((tg) => (
                    <Tag key={tg}>{tg}</Tag>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 border-t pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      setExpanded((s) => {
                        const n = new Set(s)
                        n.has(t.id) ? n.delete(t.id) : n.add(t.id)
                        return n
                      })
                    }
                  >
                    {isOpen ? '收起' : '展开'} <ChevronRight size={14} className={`transition ${isOpen ? 'rotate-90' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm"><Copy size={14} /> 复制</Button>
                  <Button variant={isStar ? 'soft' : 'ghost'} size="sm" onClick={fav}>
                    <Star size={14} /> {isStar ? '已藏' : '收藏'}
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
