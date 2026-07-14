import { Link } from 'react-router-dom'
import { Lock, ArrowRight } from 'lucide-react'
import { Card, Progress, Badge, SectionTitle } from '@/components/ui'
import { SubjectIcon } from '@/components/ui'
import { SUBJECTS } from '@/data/mock'
import { useApp } from '@/context/AppContext'
import { useData } from '@/context/DataContext'

export default function Subjects() {
  const { setActiveSubject, grade } = useApp()
  const { weaknesses, papers } = useData()
  const enabled = SUBJECTS.filter((s) => s.enabled)
  const disabled = SUBJECTS.filter((s) => !s.enabled)

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">分科学习</h1>
          <p className="page-subtitle">按学科查看掌握度、薄弱点与近期试卷，进入对应训练。</p>
        </div>
      </div>

      {/* 已上线学科 */}
      <div>
        <SectionTitle title="已上线学科" subtitle="语数英物 · 点击进入学科训练" />
        <div className="grid-cards">
          {enabled.map((s) => {
            const wCount = weaknesses.filter((w) => w.subject === s.key).length
            const exams = papers.filter((e) => e.subject === s.key).length
            return (
              <Link
                key={s.key}
                to="/weakness"
                onClick={() => setActiveSubject(s.key)}
                className="block"
              >
                <Card hover className="h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${s.color}1a`, color: s.color }}
                      >
                        <SubjectIcon subjectKey={s.key} size={22} />
                      </span>
                      <div>
                        <p className="text-base font-semibold text-main">{s.name}</p>
                        <p className="text-xs text-muted">{exams} 份试卷 · {wCount} 项弱点</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-muted" />
                  </div>
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-sub">综合掌握度</span>
                      <span className="font-semibold text-main">{s.mastery}%</span>
                    </div>
                    <Progress value={s.mastery} tone={s.color} />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 待开放学科 */}
      <div>
        <SectionTitle title="待开放学科" subtitle="架构已预留接口，按计划逐步上线" />
        <div className="grid-cards">
          {disabled.map((s) => (
            <Card key={s.key} className="h-full opacity-70">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-muted">
                  <SubjectIcon subjectKey={s.key} size={22} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-sub">{s.name}</p>
                    <Lock size={14} className="text-muted" />
                  </div>
                  <p className="text-xs text-muted">接口已预留</p>
                </div>
                <Badge tone="gray">待上线</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
