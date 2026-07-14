import { useState } from 'react'
import { Swords, CheckCircle2, XCircle, Lightbulb, RotateCcw, Target, ChevronRight } from 'lucide-react'
import { Card, Button, Badge, Difficulty, SectionTitle, SubjectIcon } from '@/components/ui'
import { QUESTIONS, WEAKNESSES, SUBJECTS } from '@/data/mock'
import type { Question } from '@/types'

export default function Training() {
  const queue = QUESTIONS
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const q: Question = queue[idx]
  const sub = SUBJECTS.find((s) => s.key === q.subject)!
  const weakness = WEAKNESSES.find((w) => w.subject === q.subject && w.knowledge === q.knowledge)
  const correct = picked === q.answer

  const submit = () => picked && setSubmitted(true)
  const next = () => {
    setIdx((i) => (i + 1) % queue.length)
    setPicked(null)
    setSubmitted(false)
  }
  const retry = () => {
    setPicked(null)
    setSubmitted(false)
  }

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">靶向出题训练</h1>
          <p className="page-subtitle">AI 根据专属薄弱点生成同考点 / 同难度 / 同题型变式题，专项突破。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* 左：题目主体 */}
        <div className="lg:col-span-3 space-y-5">
          <Card>
            {/* 题头 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${sub.color}1a`, color: sub.color }}>
                  <SubjectIcon subjectKey={q.subject} size={18} />
                </span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-main">{sub.name}</span>
                  <Badge tone="gray">{q.grade}</Badge>
                  <Badge tone="gray">{q.type}</Badge>
                  <span className="text-muted">·</span>
                  <Difficulty level={q.difficulty} />
                </div>
              </div>
              {weakness && (
                <Badge tone="amber">
                  <Target size={12} className="mr-1" /> 来源弱点：{weakness.knowledge}
                </Badge>
              )}
            </div>

            {/* 题干 */}
            <div className="py-5">
              <p className="mb-1 text-xs text-muted">第 {idx + 1} 题 · 知识点：{q.knowledge}</p>
              <p className="text-[15px] leading-relaxed text-main">{q.stem}</p>
            </div>

            {/* 选项 / 作答 */}
            {q.options ? (
              <div className="space-y-2.5">
                {q.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i)
                  const isPicked = picked === letter
                  const isAnswer = q.answer === letter
                  let cls = 'border'
                  if (submitted) {
                    if (isAnswer) cls = 'border-brand-500 bg-brand-50'
                    else if (isPicked) cls = 'border-red-400 bg-red-50'
                  } else if (isPicked) {
                    cls = 'border-brand-500 bg-brand-50'
                  }
                  return (
                    <button
                      key={i}
                      disabled={submitted}
                      onClick={() => setPicked(letter)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${cls} ${!submitted ? 'hover:border-brand-300' : ''}`}
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${isPicked || (submitted && isAnswer) ? 'bg-brand-500 text-white' : 'bg-gray-100 text-sub'}`}>
                        {letter}
                      </span>
                      <span className="flex-1 text-main">{opt}</span>
                      {submitted && isAnswer && <CheckCircle2 size={18} className="text-brand-500" />}
                      {submitted && isPicked && !isAnswer && <XCircle size={18} className="text-red-500" />}
                    </button>
                  )
                })}
              </div>
            ) : (
              <textarea
                className="input-base min-h-[120px] resize-y"
                placeholder="请在此作答…"
                value={picked ?? ''}
                onChange={(e) => setPicked(e.target.value)}
                disabled={submitted}
              />
            )}

            {/* 操作区 */}
            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <span className="text-xs text-muted">第 {idx + 1} / {queue.length} 题</span>
              <div className="flex gap-2">
                {!submitted ? (
                  <Button onClick={submit} disabled={!picked}>
                    <CheckCircle2 size={16} /> 提交批改
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={retry}>
                      <RotateCcw size={14} /> 重做
                    </Button>
                    <Button onClick={next}>
                      下一题 <ChevronRight size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* 答案解析 */}
          {submitted && (
            <Card className="space-y-3 fade-in">
              <div className="flex items-center gap-2">
                {correct ? (
                  <Badge tone="green"><CheckCircle2 size={13} className="mr-1" /> 回答正确</Badge>
                ) : (
                  <Badge tone="red"><XCircle size={13} className="mr-1" /> 回答错误</Badge>
                )}
                <span className="text-xs text-muted">正确答案：{q.answer}</span>
              </div>
              <div className="rounded-xl bg-amber-50/50 p-4">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <Lightbulb size={14} /> 详细解析
                </p>
                <p className="text-sm leading-relaxed text-main">{q.analysis}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {q.tags.map((t) => (
                  <Badge key={t} tone="gray">{t}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* 右：题序导航 + 训练说明 */}
        <div className="space-y-5">
          <Card>
            <SectionTitle title="本次训练" subtitle={`共 ${queue.length} 题 · 变式题`} />
            <div className="grid grid-cols-5 gap-2">
              {queue.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIdx(i)
                    retry()
                  }}
                  className={`flex h-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                    i === idx ? 'bg-brand-500 text-white' : 'bg-gray-50 text-sub hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="闭环进度" />
            <ol className="space-y-3 text-sm">
              {[
                { t: '录入试卷', done: true },
                { t: '弱点诊断', done: true },
                { t: '靶向出题', done: true, now: true },
                { t: '刷题训练', done: submitted },
                { t: '二次复盘', done: false },
              ].map((s, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${s.done ? 'bg-brand-500 text-white' : 'bg-gray-100 text-muted'}`}>
                    {s.done ? '✓' : i + 1}
                  </span>
                  <span className={s.now ? 'font-semibold text-brand-700' : s.done ? 'text-main' : 'text-muted'}>{s.t}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <SectionTitle title="训练说明" />
            <p className="text-xs leading-relaxed text-sub">
              提交后系统自动批改并写入弱点档案，掌握度达标则该薄弱点降级；持续未掌握则难度回调，适配个人节奏。
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
