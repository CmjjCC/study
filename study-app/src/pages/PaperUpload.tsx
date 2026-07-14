import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImageUp, ClipboardList, Edit3, Sparkles, CheckCircle2, Loader2, FileText } from 'lucide-react'
import { Card, Button, Badge, SectionTitle, SubjectIcon } from '@/components/ui'
import { SUBJECTS, DIAGNOSTIC_POOL } from '@/data/mock'
import { useData } from '@/context/DataContext'
import { useApp } from '@/context/AppContext'
import type { SubjectKey, ExamPaper, WeaknessType } from '@/types'

type Mode = 'image' | 'paste' | 'score'
type Stage = 'idle' | 'parsing' | 'done'

const MODES: { key: Mode; label: string; icon: typeof ImageUp; desc: string }[] = [
  { key: 'image', label: '上传试卷图片', icon: ImageUp, desc: 'AI 自动 OCR 识别题干、答案与得分' },
  { key: 'paste', label: '粘贴错题文本', icon: ClipboardList, desc: '直接粘贴题目文本，AI 结构化解析' },
  { key: 'score', label: '录入得分情况', icon: Edit3, desc: '按题录入得分与失分原因' },
]

const TYPES: WeaknessType[] = ['基础漏洞', '题型短板', '解题思路缺陷', '应试易错误区']

export default function PaperUpload() {
  const navigate = useNavigate()
  const { addDiagnosis, papers } = useData()
  const { grade } = useApp()
  const [mode, setMode] = useState<Mode>('image')
  const [stage, setStage] = useState<Stage>('idle')
  const [subject, setSubject] = useState<SubjectKey>('math')
  const [paper, setPaper] = useState<ExamPaper | null>(null)

  const startParse = () => {
    const sub = SUBJECTS.find((s) => s.key === subject)!
    const p: ExamPaper = {
      id: `p-${Date.now()}`,
      name: `${grade}${sub.name}${mode === 'image' ? '试卷图片' : mode === 'paste' ? '错题文本' : '得分录入'}诊断`,
      subject,
      grade,
      date: new Date().toISOString().slice(0, 10),
      score: 0,
      total: 100,
      questionCount: 20,
      status: '已解析',
    }
    setPaper(p)
    setStage('parsing')
    setTimeout(() => {
      setStage('done')
      addDiagnosis(p, subject)
    }, 1600)
  }

  const reset = () => {
    setStage('idle')
    setPaper(null)
  }

  const subName = SUBJECTS.find((s) => s.key === subject)!.name
  const generated = paper ? DIAGNOSTIC_POOL.filter((w) => w.subject === subject) : []
  const typeCounts = TYPES.map((t) => ({ t, n: generated.filter((w) => w.type === t).length })).filter((x) => x.n > 0)

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">试卷录入</h1>
          <p className="page-subtitle">AI 自动解析每题对应学科、年级、知识点与薄弱类型，进入闭环第一步。</p>
        </div>
      </div>

      {/* 闭环步骤条 */}
      <Card pad="sm">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['试卷录入', '弱点诊断', '分析总结', '靶向出题', '刷题训练', '二次复盘'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${i === 0 ? 'bg-brand-500 text-white' : 'bg-gray-100 text-sub'}`}>
                {i + 1}
              </span>
              <span className={i === 0 ? 'font-semibold text-brand-700' : 'text-sub'}>{s}</span>
              {i < 5 && <span className="text-muted">→</span>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 左：录入区 */}
        <div className="lg:col-span-2 space-y-5">
          {/* 录入方式 tabs */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {MODES.map((m) => {
              const Icon = m.icon
              const active = mode === m.key
              return (
                <button
                  key={m.key}
                  onClick={() => {
                    setMode(m.key)
                    reset()
                  }}
                  className={`rounded-xl border p-4 text-left transition ${active ? 'border-brand-500 bg-brand-50/60' : 'hover:border-gray-300'}`}
                >
                  <Icon size={20} className={active ? 'text-brand-600' : 'text-sub'} />
                  <p className="mt-2 text-sm font-medium text-main">{m.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{m.desc}</p>
                </button>
              )
            })}
          </div>

          {/* 学科选择 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-sub">学科：</span>
            {SUBJECTS.filter((s) => s.enabled).map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setSubject(s.key)
                  reset()
                }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition ${
                  subject === s.key ? 'border-brand-500 bg-brand-50 text-brand-700' : 'text-sub hover:bg-black/[0.04]'
                }`}
              >
                <SubjectIcon subjectKey={s.key} size={14} />
                {s.name}
              </button>
            ))}
          </div>

          {/* 录入主体 */}
          <Card>
            {stage === 'idle' && mode === 'image' && (
              <div className="rounded-xl border-2 border-dashed border-gray-300 px-6 py-12 text-center transition hover:border-brand-400 hover:bg-brand-50/30">
                <ImageUp size={32} className="mx-auto text-muted" />
                <p className="mt-3 text-sm font-medium text-main">点击或拖拽上传试卷图片</p>
                <p className="mt-1 text-xs text-muted">支持 JPG / PNG / PDF，单次最多 20 张</p>
                <Button className="mt-4" onClick={startParse}>
                  <Sparkles size={16} /> 选择文件并开始解析
                </Button>
              </div>
            )}

            {stage === 'idle' && mode === 'paste' && (
              <div>
                <textarea
                  className="input-base min-h-[160px] resize-y"
                  placeholder="在此粘贴题目文本，例如：&#10;1. 已知 f(x)=x²-2ax+3...&#10;2. 导体棒在磁场中由静止释放..."
                />
                <div className="mt-3 flex justify-end">
                  <Button onClick={startParse}>
                    <Sparkles size={16} /> AI 解析并入库
                  </Button>
                </div>
              </div>
            )}

            {stage === 'idle' && mode === 'score' && (
              <div>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2">
                      <input className="input-base col-span-1" placeholder={`${i + 1}`} />
                      <input className="input-base col-span-6" placeholder="题干 / 知识点" />
                      <input className="input-base col-span-2" placeholder="得分" />
                      <input className="input-base col-span-3" placeholder="失分原因" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between">
                  <Button variant="ghost" size="sm">+ 添加一行</Button>
                  <Button onClick={startParse}>
                    <Sparkles size={16} /> 提交并诊断
                  </Button>
                </div>
              </div>
            )}

            {stage === 'parsing' && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 size={32} className="animate-spin text-brand-500" />
                <p className="mt-3 text-sm font-medium text-main">AI 正在解析试卷…</p>
                <p className="mt-1 text-xs text-muted">OCR 识别 → 题目结构化 → 知识点标注 → 薄弱类型分类</p>
              </div>
            )}

            {stage === 'done' && paper && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 size={36} className="text-brand-500" />
                <p className="mt-3 text-sm font-semibold text-main">
                  {subName} 试卷解析完成 · 已写入「{grade}」年级档案
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {typeCounts.map((c) => (
                    <Badge key={c.t} tone="amber">{c.t} ×{c.n}</Badge>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  <Button variant="outline" onClick={reset}>
                    重新录入
                  </Button>
                  <Button onClick={() => navigate('/weakness')}>
                    查看弱点报告 →
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* 右：使用说明 + 已录入试卷（来自当前年级）*/}
        <div className="space-y-5">
          <Card>
            <SectionTitle title="录入指引" />
            <ul className="space-y-2.5 text-sm text-sub">
              {[
                '图片越清晰，OCR 识别越准；建议扫描件或正拍高清照。',
                '粘贴文本时按「题号. 题干」分行，便于 AI 切分。',
                '录入得分可只填失分题，正确题留空即可。',
                '解析完成后自动生成该年级弱点档案并推荐靶向训练。',
              ].map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionTitle title={`已录入试卷（${grade}）`} subtitle="切换年级查看对应档案" />
            {papers.length === 0 ? (
              <p className="rounded-lg border border-dashed py-8 text-center text-xs text-muted">
                未上传信息，暂无试卷
              </p>
            ) : (
              <div className="space-y-2">
                {papers.map((e) => {
                  const sub = SUBJECTS.find((s) => s.key === e.subject)!
                  return (
                    <div key={e.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${sub.color}1a`, color: sub.color }}>
                        <FileText size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-main">{e.name}</p>
                        <p className="text-[11px] text-muted">{e.date} · {e.questionCount} 题</p>
                      </div>
                      <Badge tone="green">{e.status}</Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
