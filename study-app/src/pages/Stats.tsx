import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'
import { Clock, ListChecks, TrendingUp, Flame } from 'lucide-react'
import { Card, SectionTitle, StatTile, Progress, SubjectIcon, Empty } from '@/components/ui'
import { SUBJECTS } from '@/data/mock'
import { useData } from '@/context/DataContext'
import { useApp } from '@/context/AppContext'

function EmptyChart({ text }: { text: string }) {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-dashed text-center">
      <p className="text-sm font-medium text-main">暂无数据</p>
      <p className="mt-1 max-w-xs text-xs text-muted">{text}</p>
    </div>
  )
}

export default function Stats() {
  const { grade } = useApp()
  const { studyLog, studyStats, subjectMastery } = useData()

  const totalMin = studyLog.reduce((a, b) => a + b.minutes, 0)
  const totalQ = studyLog.reduce((a, b) => a + b.questions, 0)
  const totalC = studyLog.reduce((a, b) => a + b.correct, 0)
  const avgAcc = totalQ ? Math.round((totalC / totalQ) * 100) : 0

  // 连续打卡天数：从最近一次学习日起向前数连续日期
  const dates = [...new Set(studyLog.map((e) => e.date))].sort().reverse()
  let streak = 0
  let prev: number | null = null
  for (const d of dates) {
    const t = new Date(d.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3')).getTime()
    if (prev !== null) {
      const diff = Math.round((prev - t) / 86400000)
      if (diff === 1) streak++
      else break
    } else {
      streak = 1
    }
    prev = t
  }

  const hasData = studyLog.length > 0
  const enabledSubjects = SUBJECTS.filter((s) => s.enabled)
  const masteryList = enabledSubjects.map((s) => ({ s, m: subjectMastery(s.key) }))
  const hasMastery = masteryList.some((x) => x.m !== null)

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">学习记录</h1>
          <p className="page-subtitle">时长、题量、正确率与学科掌握度，全程基于真实记录 · 当前年级：{grade}</p>
        </div>
      </div>

      {/* 统计 tile */}
      <div className="grid-cards-4">
        <StatTile label="累计学习时长" value={totalMin ? Math.round(totalMin / 60) : 0} unit="小时" hint={totalMin ? `累计 ${totalMin} 分钟` : '暂无记录'} icon={<Clock size={16} />} />
        <StatTile label="累计刷题量" value={totalQ} unit="题" hint={totalQ ? `答对 ${totalC} 题` : '暂无记录'} icon={<ListChecks size={16} />} tone="#3b82f6" />
        <StatTile label="平均正确率" value={totalQ ? avgAcc : '—'} unit={totalQ ? '%' : ''} hint={totalQ ? `基于 ${totalQ} 题` : '暂无记录'} icon={<TrendingUp size={16} />} tone="#a855f7" />
        <StatTile label="连续打卡" value={streak} unit="天" hint={streak ? '保持下去' : '暂未打卡'} icon={<Flame size={16} />} tone="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 每日学习时长 */}
        <Card>
          <SectionTitle title="每日学习时长" subtitle="真实学习记录（分钟）" />
          {!hasData ? (
            <EmptyChart text="暂无学习数据。开始靶向训练后记录于此。" />
          ) : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyStats} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef1ec" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a39b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a39b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1ec', fontSize: 12 }} cursor={{ fill: '#f5f7f3' }} />
                  <Bar dataKey="minutes" name="时长" fill="#33a566" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* 正确率趋势 */}
        <Card>
          <SectionTitle title="正确率趋势" subtitle="真实刷题正确率（%）" />
          {!hasData ? (
            <EmptyChart text="暂无学习数据。正确率将随训练记录更新。" />
          ) : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studyStats} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef1ec" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a39b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a39b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1ec', fontSize: 12 }} />
                  <Area type="monotone" dataKey="accuracy" name="正确率" stroke="#a855f7" strokeWidth={2.5} fill="url(#accGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* 热力图 + 学科掌握度 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="学习热力图" subtitle="颜色越深当日学习强度越大" />
          {!hasData ? (
            <EmptyChart text="暂无学习数据。每日学习强度将在此热力展示。" />
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1.5">
                {studyStats.map((h) => {
                  const intensity = Math.min(1, h.minutes / 30)
                  const alpha = 0.1 + intensity * 0.9
                  return (
                    <div
                      key={h.date}
                      title={`${h.date} · ${h.minutes} 分钟`}
                      className="aspect-square rounded-md"
                      style={{ backgroundColor: `rgba(51,165,102,${alpha})` }}
                    />
                  )
                })}
              </div>
              <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted">
                少
                {[0.15, 0.35, 0.55, 0.75, 0.95].map((a) => (
                  <span key={a} className="h-3 w-3 rounded-sm" style={{ backgroundColor: `rgba(51,165,102,${a})` }} />
                ))}
                多
              </div>
            </>
          )}
        </Card>

        <Card>
          <SectionTitle title="学科掌握度" subtitle={`基于${grade}弱点档案`} />
          {!hasMastery ? (
            <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-dashed text-center">
              <p className="text-sm font-medium text-main">暂无数据</p>
              <p className="mt-1 text-xs text-muted">录入试卷诊断弱点后展示</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {masteryList.map(({ s, m }) => (
                <div key={s.key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-sub">
                      <SubjectIcon subjectKey={s.key} size={14} /> {s.name}
                    </span>
                    <span className="font-semibold text-main">{m === null ? '暂无' : `${m}%`}</span>
                  </div>
                  <Progress value={m ?? 0} tone={s.color} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
