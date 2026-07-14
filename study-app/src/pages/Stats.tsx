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
import { Card, SectionTitle, StatTile, Progress, SubjectIcon } from '@/components/ui'
import { STUDY_STATS, SUBJECTS, MASTERY_TREND } from '@/data/mock'

export default function Stats() {
  const totalMin = STUDY_STATS.reduce((a, b) => a + b.minutes, 0)
  const totalQ = STUDY_STATS.reduce((a, b) => a + b.questions, 0)
  const avgAcc = Math.round(STUDY_STATS.reduce((a, b) => a + b.accuracy, 0) / STUDY_STATS.length)
  const streak = 14

  // 学习热力图：14 天强度
  const heatmap = STUDY_STATS.map((s) => {
    const intensity = Math.min(1, s.minutes / 90)
    return { date: s.date, intensity }
  })

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">学习记录</h1>
          <p className="page-subtitle">时长、题量、正确率与学科掌握度，全程可追溯。</p>
        </div>
      </div>

      {/* 统计 tile */}
      <div className="grid-cards-4">
        <StatTile label="累计学习时长" value={Math.round(totalMin / 60)} unit="小时" icon={<Clock size={16} />} />
        <StatTile label="累计刷题量" value={totalQ} unit="题" icon={<ListChecks size={16} />} tone="#3b82f6" />
        <StatTile label="平均正确率" value={avgAcc} unit="%" icon={<TrendingUp size={16} />} tone="#a855f7" />
        <StatTile label="连续打卡" value={streak} unit="天" icon={<Flame size={16} />} tone="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 每日学习时长 */}
        <Card>
          <SectionTitle title="每日学习时长" subtitle="近 14 天（分钟）" />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STUDY_STATS} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1ec" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a39b' }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 11, fill: '#94a39b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1ec', fontSize: 12 }} cursor={{ fill: '#f5f7f3' }} />
                <Bar dataKey="minutes" name="时长" fill="#33a566" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 正确率趋势 */}
        <Card>
          <SectionTitle title="正确率趋势" subtitle="近 14 天（%）" />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={STUDY_STATS} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1ec" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a39b' }} axisLine={false} tickLine={false} interval={1} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#94a39b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1ec', fontSize: 12 }} />
                <Area type="monotone" dataKey="accuracy" name="正确率" stroke="#a855f7" strokeWidth={2.5} fill="url(#accGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 热力图 + 学科掌握度 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="学习热力图" subtitle="颜色越深当日学习强度越大" />
          <div className="grid grid-cols-7 gap-1.5">
            {heatmap.map((h) => {
              const alpha = 0.1 + h.intensity * 0.9
              return (
                <div
                  key={h.date}
                  title={`${h.date} · 强度 ${Math.round(h.intensity * 100)}%`}
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
        </Card>

        <Card>
          <SectionTitle title="学科掌握度" />
          <div className="space-y-3.5">
            {SUBJECTS.filter((s) => s.enabled).map((s) => (
              <div key={s.key}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-sub">
                    <SubjectIcon subjectKey={s.key} size={14} /> {s.name}
                  </span>
                  <span className="font-semibold text-main">{s.mastery}%</span>
                </div>
                <Progress value={s.mastery} tone={s.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 各学科掌握度趋势 */}
      <Card>
        <SectionTitle title="各学科掌握度对比" subtitle="近五周掌握度走势" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {MASTERY_TREND[MASTERY_TREND.length - 1] &&
            (['math', 'physics', 'english', 'chinese'] as const).map((k) => {
              const sub = SUBJECTS.find((s) => s.key === k)!
              const latest = MASTERY_TREND[MASTERY_TREND.length - 1][k] as number
              const prev = MASTERY_TREND[0][k] as number
              const delta = latest - prev
              return (
                <div key={k} className="rounded-xl border p-4">
                  <div className="flex items-center gap-1.5 text-xs text-sub">
                    <SubjectIcon subjectKey={k} size={13} /> {sub.name}
                  </div>
                  <p className="mt-2 text-xl font-bold text-main">{latest}%</p>
                  <p className={`mt-0.5 text-xs ${delta >= 0 ? 'text-brand-600' : 'text-red-500'}`}>
                    {delta >= 0 ? '↑' : '↓'} 较五周前 {Math.abs(delta)}%
                  </p>
                </div>
              )
            })}
        </div>
      </Card>
    </div>
  )
}
