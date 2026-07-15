import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Swords, CheckCircle2, XCircle, Lightbulb, RotateCcw, Target, ChevronRight, FileUp } from 'lucide-react'
import { Card, Button, Badge, Difficulty, SectionTitle, SubjectIcon, Empty } from '@/components/ui'
import { QUESTION_BANK, SUBJECTS } from '@/data/mock'
import { useApp } from '@/context/AppContext'
import { useData } from '@/context/DataContext'
import type { Question } from '@/types'

export default function Training() {
  const { grade } = useApp()
  const { weaknesses, addStudyLog } = useData()

  // 靶向出题：必须录入试卷产生弱点后才出题，按弱点的学科/知识点匹配当前年级题库
  const queue = useMemo<Question[]>(() => {
    const targeted = weaknesses.flatMap((w) => {
      const subjectQs = QUESTION_BANK.filter((q) => q.subject === w.subject && q.grade === grade)
      const byKnowledge = subjectQs.filter((q) => q.knowledge === w.knowledge)
      const pool = byKnowledge.length ? byKnowledge : subjectQs
      return pool.slice(0, 1)
    })
    return [...new Map(targeted.map((q) => [q.id, q] as [string, Question])).values()]
  }, [weaknesses, grade])

  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setIdx(0)
    setPicked(null)
    setSubmitted(false)
  }, [grade])

  const head = (
    <div className="page-head">
      <div>
        <h1 className="page-title">靶向出题训练</h1>
        <p className="page-subtitle">根据录入试卷的年级与薄弱点难度智能出题 · 当前年级：{grade}</p>
      </div>
    </div>
  )

  if (weaknesses.length === 0) {
    return (
      <div className="space-y-6">
        {head}
        <Empty
          title="暂无薄弱点，无法靶向出题"
          desc="靶向出题需基于录入试卷的诊断结果。请先录入试卷，AI 将依据薄弱点智能出题。"
          action={
            <Link to="/paper-upload">
              <Button><FileUp size={16} /> 去录入试卷</Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (queue.length === 0) {
    return (
      <div className="space-y-6">
        {head}
        <Empty title={`「${grade}」暂无匹配靶向题`} desc="已诊断薄弱点，但该年级题库暂无对应题目。可切换年级或录入其他学科试卷。" />
      </div>
    )
  }

  const q: Question = queue[idx % queue.length]
  const sub = SUBJECTS.find((s) => s.key === q.subject)!
  const weakness = weaknesses.find((w) => w.subject === q.subject && w.knowledge === q.knowledge)
  const correct = picked === q.answer

  const submit = () => {
    if (!picked) return
    setSubmitted(true)
    addStudyLog({
      date: new Date().toISOString().slice(0, 10),
      minutes: 3,
      questions: 1,
      correct: picked === q.answer ? 1 : 0,
    })
  }
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
      {head}
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
            <SectionTitle title="本次训练" subtitle={`共 ${queue.length} 题 · 靶向变式题`} />
            <div className="grid grid-cols-5 gap-2">
              {queue.map((qq, i) => (
                <button
                  key={qq.id}
                  onClick={() => { setIdx(i); retry() }}
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
              题目依据已录入试卷的薄弱点生成，提交后自动批改并记入学习记录，掌握度达标则弱点降级；持续未掌握则难度回调。
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
