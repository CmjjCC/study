import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts'
import { Clock, ListChecks, Target, TrendingUp, FileUp, Swords, ArrowRight, Sparkles } from 'lucide-react'
import { Card, SectionTitle, StatTile, Button, PriorityBadge, WeaknessTypeBadge, Progress } from '@/components/ui'
import { SUBJECTS, MASTERY_TREND, STUDY_STATS } from '@/data/mock'
import { useData } from '@/context/DataContext'
import { useApp } from '@/context/AppContext'

const SUBJECT_NAME: Record<string, string> = {
  chinese: '语文',
  math: '数学',
  english: '英语',
  physics: '物理',
}

export default function Dashboard() {
  const { grade } = useApp()
  const { weaknesses, papers } = useData()
  const enabledSubjects = SUBJECTS.filter((s) => s.enabled)
  const radarData = enabledSubjects.map((s) => ({ subject: s.name, mastery: s.mastery }))
  const totalMinutes = STUDY_STATS.reduce((a, b) => a + b.minutes, 0)
  const totalQ = STUDY_STATS.reduce((a, b) => a + b.questions, 0)
  const avgAcc = Math.round(STUDY_STATS.reduce((a, b) => a + b.accuracy, 0) / STUDY_STATS.length)
  const topWeakness = [...weaknesses]
    .sort((a, b) => ({ 高: 0, 中: 1, 低: 2 }[a.priority]) - ({ 高: 0, 中: 1, 低: 2 }[b.priority]))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Hero 闭环引导 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-7 text-white shadow-card-hover">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-50">
            <Sparkles size={16} /> AI 提分闭环
          </div>
          <h1 className="mt-2 text-2xl font-bold leading-snug">
            试卷录入 → 弱点诊断 → 靶向出题 → 刷题训练 → 二次复盘
          </h1>
          <p className="mt-2 text-sm text-brand-50/90">
            把每一次考试变成可追踪的学情资产，精准补短板，杜绝无效刷题。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/paper-upload">
              <Button variant="primary" className="bg-white text-brand-700 hover:bg-brand-50">
                <FileUp size={16} /> 录入试卷
              </Button>
            </Link>
            <Link to="/training">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Swords size={16} /> 开始靶向训练
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -right-2 bottom-2 h-24 w-24 rounded-full bg-white/5" />
      </div>

      {/* 统计 Tile 行 */}
      <div className="grid-cards-4">
        <StatTile label="本周学习时长" value={Math.round(totalMinutes / 60)} unit="小时" hint="较上周 +8%" icon={<Clock size={16} />} />
        <StatTile label="本周刷题量" value={totalQ} unit="题" hint="较上周 +12%" icon={<ListChecks size={16} />} tone="#3b82f6" />
        <StatTile label="平均正确率" value={avgAcc} unit="%" hint="较上周 +3%" icon={<TrendingUp size={16} />} tone="#a855f7" />
        <StatTile label={`已诊断弱点（${grade}）`} value={weaknesses.length} unit="项" hint={`高优先级 ${weaknesses.filter((w) => w.priority === '高').length} 项`} icon={<Target size={16} />} tone="#f59e0b" />
      </div>

      {/* 主体网格：趋势 + 雷达 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="各学科掌握度趋势" subtitle="近五周各学科掌握度变化" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MASTERY_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1ec" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a39b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a39b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1ec', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="math" name="数学" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="physics" name="物理" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="english" name="英语" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="chinese" name="语文" stroke="#ef6c5a" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle title="学科能力分布" subtitle="当前掌握度雷达" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#eef1ec" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#5b6b62' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a39b' }} axisLine={false} />
                <Radar dataKey="mastery" stroke="#33a566" fill="#33a566" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1ec', fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 急需补强 + 近期试卷 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle
            title="急需补强的薄弱点"
            subtitle="AI 诊断 · 按优先级排序"
            right={
              <Link to="/weakness" className="text-xs font-medium text-brand-600 hover:underline">
                查看全部 <ArrowRight size={12} className="inline" />
              </Link>
            }
          />
          {topWeakness.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed py-10 text-center">
              <p className="text-sm font-medium text-main">未上传信息，暂无弱点诊断</p>
              <p className="mt-1 text-xs text-muted">录入试卷后，AI 将自动定位薄弱点</p>
              <Link to="/paper-upload">
                <Button className="mt-3" size="sm"><FileUp size={14} /> 去录入</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {topWeakness.map((w) => {
                const sub = SUBJECTS.find((s) => s.key === w.subject)!
                return (
                  <div key={w.id} className="flex items-center gap-4 rounded-xl border p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${sub.color}1a`, color: sub.color }}>
                      <span className="text-sm font-semibold">{sub.name}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-main">{w.knowledge}</span>
                        <PriorityBadge priority={w.priority} />
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <WeaknessTypeBadge type={w.type} />
                        <span className="text-xs text-muted">失分率 {w.loseRate}%</span>
                      </div>
                    </div>
                    <div className="hidden w-32 sm:block">
                      <Progress value={w.mastery} tone={sub.color} showLabel />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle
            title="近期试卷"
            right={
              <Link to="/paper-upload" className="text-xs font-medium text-brand-600 hover:underline">
                录入 <ArrowRight size={12} className="inline" />
              </Link>
            }
          />
          {papers.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed py-10 text-center">
              <p className="text-sm font-medium text-main">未上传信息，暂无试卷</p>
              <p className="mt-1 text-xs text-muted">录入试卷后，解析结果会显示在此</p>
              <Link to="/paper-upload">
                <Button className="mt-3" size="sm"><FileUp size={14} /> 去录入</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {papers.slice(0, 4).map((e) => {
                const sub = SUBJECTS.find((s) => s.key === e.subject)!
                return (
                  <div key={e.id} className="flex items-center gap-3 rounded-xl border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold" style={{ backgroundColor: `${sub.color}1a`, color: sub.color }}>
                      {sub.name}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-main">{e.name}</p>
                      <p className="text-xs text-muted">{e.date} · {e.status}</p>
                    </div>
                    {e.score > 0 ? (
                      <span className="text-sm font-semibold text-main">
                        {e.score}<span className="text-xs text-muted">/{e.total}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600">解析中</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
