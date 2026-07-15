import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, FileText, Library, ClipboardList } from 'lucide-react'
import { Card, Button, Badge, Tag, SubjectIcon, Empty } from '@/components/ui'
import { SUBJECTS } from '@/data/mock'
import { useData } from '@/context/DataContext'
import type { FavoriteKind } from '@/types'

const ICON = { 素材: Library, 模板: FileText, 题目: ClipboardList }

export default function Favorites() {
  const { favorites, toggleFavorite } = useData()
  const [tab, setTab] = useState<FavoriteKind | '全部'>('全部')
  const list = favorites.filter((f) => tab === '全部' || f.kind === tab)

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">我的收藏</h1>
          <p className="page-subtitle">收藏的素材、模板集中管理，点击星标可取消收藏。</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <Empty
          title="暂无收藏"
          desc="在素材库、模板库中点击收藏，内容会集中保存在这里。"
          action={
            <Link to="/materials">
              <Button><Library size={16} /> 去素材库</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            {(['全部', '素材', '模板', '题目'] as const).map((t) => {
              const count = t === '全部' ? favorites.length : favorites.filter((f) => f.kind === t).length
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
            <Empty title={`「${tab}」分类下暂无收藏`} desc="切换其他分类查看。" />
          ) : (
            <div className="grid-cards">
              {list.map((f) => {
                const sub = SUBJECTS.find((s) => s.key === f.subject)!
                return (
                  <Card key={`${f.kind}-${f.refId}`} hover className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <Badge tone="gray">{f.kind}</Badge>
                      <button onClick={() => toggleFavorite(f)} title="取消收藏">
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                      </button>
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
        </>
      )}
    </div>
  )
}
