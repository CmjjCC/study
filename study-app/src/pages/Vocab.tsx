import { useState } from 'react'
import { Languages, Volume2, Check, RotateCw, Brain, Calendar } from 'lucide-react'
import { Card, Button, Badge, SectionTitle, StatTile } from '@/components/ui'
import { VOCAB } from '@/data/mock'
import type { VocabWord } from '@/types'

const STAGE_TONE: Record<VocabWord['stage'], 'gray' | 'amber' | 'blue' | 'green'> = {
  新词: 'gray',
  学习中: 'amber',
  复习中: 'blue',
  已掌握: 'green',
}

export default function Vocab() {
  const today = VOCAB.filter((v) => v.nextReview === '今日')
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [learned, setLearned] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setRevealed((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const mark = (id: string) =>
    setLearned((s) => new Set(s).add(id))

  const mastered = VOCAB.filter((v) => v.stage === '已掌握').length

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">单词记忆</h1>
          <p className="page-subtitle">基于艾宾浩斯遗忘曲线，智能安排背诵与复习节奏。</p>
        </div>
        <Button><Languages size={16} /> 学习今日新词</Button>
      </div>

      {/* 概览 */}
      <div className="grid-cards-4">
        <StatTile label="今日待复习" value={today.length} unit="词" icon={<RotateCw size={16} />} tone="#3b82f6" />
        <StatTile label="今日新词" value={VOCAB.filter((v) => v.stage === '新词').length} unit="词" icon={<Languages size={16} />} tone="#a855f7" />
        <StatTile label="已掌握" value={mastered} unit="词" icon={<Check size={16} />} />
        <StatTile label="记忆曲线状态" value="良好" icon={<Brain size={16} />} tone="#f59e0b" />
      </div>

      {/* 今日复习列表 */}
      <Card>
        <SectionTitle
          title="今日复习卡片"
          subtitle="点击卡片翻转查看释义，掌握后标记"
          right={<Badge tone="blue"><Calendar size={12} className="mr-1" /> 今日 · {today.length} 词</Badge>}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {today.map((w) => {
            const shown = revealed.has(w.id)
            const done = learned.has(w.id)
            return (
              <div
                key={w.id}
                className={`relative cursor-pointer rounded-xl border p-4 transition ${done ? 'opacity-60' : 'hover:border-brand-300'}`}
                onClick={() => toggle(w.id)}
              >
                <div className="flex items-center justify-between">
                  <Badge tone={STAGE_TONE[w.stage]}>{w.stage}</Badge>
                  <Volume2 size={16} className="text-muted hover:text-brand-600" />
                </div>
                <p className="mt-3 text-lg font-bold text-main">{w.word}</p>
                <p className="text-xs text-muted">{w.phonetic}</p>
                <div className="mt-3 min-h-[44px]">
                  {shown ? (
                    <div className="fade-in">
                      <p className="text-sm text-main">{w.meaning}</p>
                      <p className="mt-1 text-xs italic text-sub">e.g. {w.example}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted">点击查看释义…</p>
                  )}
                </div>
                {shown && !done && (
                  <Button size="sm" variant="soft" className="mt-3 w-full" onClick={(e) => { e.stopPropagation(); mark(w.id) }}>
                    <Check size={14} /> 已掌握
                  </Button>
                )}
                {done && (
                  <p className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-brand-600">
                    <Check size={14} /> 已掌握
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* 全部词库 */}
      <Card>
        <SectionTitle title="全部词库" subtitle="按学习阶段分类" />
        <div className="space-y-2">
          {VOCAB.map((w) => (
            <div key={w.id} className="flex items-center gap-3 rounded-lg border p-3">
              <Badge tone={STAGE_TONE[w.stage]}>{w.stage}</Badge>
              <span className="font-medium text-main">{w.word}</span>
              <span className="text-xs text-muted">{w.phonetic}</span>
              <span className="ml-auto hidden text-sm text-sub sm:block">{w.meaning}</span>
              <span className="text-xs text-muted">下次：{w.nextReview}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
