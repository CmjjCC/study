import { useState, useEffect } from 'react'
import { Languages, Volume2, Check, RotateCw, BookOpen, Brain } from 'lucide-react'
import { Card, Button, Badge, SectionTitle, StatTile, Empty } from '@/components/ui'
import { VOCAB_BOOKS } from '@/data/mock'
import { useData } from '@/context/DataContext'

type Stage = '新词' | '学习中' | '复习中' | '已掌握'
const STAGE_TONE: Record<Stage, 'gray' | 'amber' | 'blue' | 'green'> = {
  新词: 'gray',
  学习中: 'amber',
  复习中: 'blue',
  已掌握: 'green',
}

export default function Vocab() {
  const { vocabBook, vocabProgress, setVocabBook, setVocabStage } = useData()
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  useEffect(() => {
    setRevealed(new Set())
  }, [vocabBook])

  const book = VOCAB_BOOKS.find((b) => b.id === vocabBook)
  const words = book?.words ?? []
  const mastered = words.filter((w) => vocabProgress[w.id] === '已掌握').length
  const learning = words.filter((w) => vocabProgress[w.id] === '学习中' || vocabProgress[w.id] === '复习中').length
  const progress = words.length ? Math.round((mastered / words.length) * 100) : 0

  const toggle = (id: string) =>
    setRevealed((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const mark = (id: string) => setVocabStage(id, '已掌握')
  const startLearn = (id: string) => setVocabStage(id, '学习中')

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">单词记忆</h1>
          <p className="page-subtitle">选择单词书开始学习，进度随学习自动记录。</p>
        </div>
      </div>

      {/* 单词书选择 */}
      <Card>
        <SectionTitle title="选择单词书" subtitle="点击切换学习词书" />
        <div className="grid-cards">
          {VOCAB_BOOKS.map((b) => {
            const active = vocabBook === b.id
            return (
              <button
                key={b.id}
                onClick={() => setVocabBook(b.id)}
                className={`rounded-xl border p-4 text-left transition ${active ? 'border-brand-500 bg-brand-50/60' : 'hover:border-gray-300'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? 'bg-brand-500 text-white' : 'bg-gray-50 text-sub'}`}>
                    <BookOpen size={17} />
                  </span>
                  {active && <Badge tone="green">学习中</Badge>}
                </div>
                <p className="mt-3 text-sm font-semibold text-main">{b.name}</p>
                <p className="mt-0.5 text-xs text-muted">{b.desc}</p>
                <p className="mt-2 text-xs text-muted">共 {b.words.length} 词</p>
              </button>
            )
          })}
        </div>
      </Card>

      {/* 概览 */}
      <div className="grid-cards-4">
        <StatTile label="当前词书" value={book ? book.name : '未选择'} icon={<BookOpen size={16} />} />
        <StatTile label="词书总词数" value={words.length} unit="词" icon={<Languages size={16} />} tone="#3b82f6" />
        <StatTile label="已掌握" value={mastered} unit="词" hint={words.length ? `学习中 ${learning}` : '暂未学习'} icon={<Check size={16} />} tone="#a855f7" />
        <StatTile label="掌握进度" value={progress} unit="%" icon={<Brain size={16} />} tone="#f59e0b" />
      </div>

      {/* 今日学习 */}
      {!book ? (
        <Empty title="请选择单词书" desc="选择一本词书后，开始今日学习。" />
      ) : (
        <Card>
          <SectionTitle title={`${book.name} · 今日学习`} subtitle="点击卡片翻转查看释义" right={<Badge tone="blue">{words.length} 词</Badge>} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {words.map((w) => {
              const stage: Stage = vocabProgress[w.id] ?? '新词'
              const shown = revealed.has(w.id)
              const done = stage === '已掌握'
              return (
                <div
                  key={w.id}
                  className={`cursor-pointer rounded-xl border p-4 transition ${done ? 'opacity-60' : 'hover:border-brand-300'}`}
                  onClick={() => toggle(w.id)}
                >
                  <div className="flex items-center justify-between">
                    <Badge tone={STAGE_TONE[stage]}>{stage}</Badge>
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
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="ghost" className="flex-1" onClick={(e) => { e.stopPropagation(); startLearn(w.id) }}>
                        <RotateCw size={14} /> 标记复习
                      </Button>
                      <Button size="sm" variant="soft" className="flex-1" onClick={(e) => { e.stopPropagation(); mark(w.id) }}>
                        <Check size={14} /> 已掌握
                      </Button>
                    </div>
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
      )}
    </div>
  )
}
