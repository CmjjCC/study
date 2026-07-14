import { Moon, Sun, User, GraduationCap, BookOpen, Shield, Info } from 'lucide-react'
import { Card, Button, Badge, SectionTitle, SubjectIcon } from '@/components/ui'
import { useApp } from '@/context/AppContext'
import { GRADES, SUBJECTS } from '@/data/mock'

export default function SettingsPage() {
  const { grade, setGrade, eyeCare, setEyeCare } = useApp()

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">设置</h1>
          <p className="page-subtitle">个人信息、学段、护眼与学科偏好。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 个人信息 */}
        <Card>
          <SectionTitle title="个人信息">
            <span className="flex items-center gap-1.5 text-xs text-sub"><User size={13} /> 资料</span>
          </SectionTitle>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-xl font-bold text-brand-700">陈</div>
            <div>
              <p className="text-base font-semibold text-main">陈同学</p>
              <p className="text-xs text-muted">study@loop.com</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">编辑</Button>
          </div>
          <div className="mt-5 space-y-3">
            <Field label="昵称" value="陈同学" />
            <Field label="目标院校" value="待填写" muted />
            <Field label="每日学习目标" value="2 小时 / 30 题" />
          </div>
        </Card>

        {/* 学段与护眼 */}
        <Card>
          <SectionTitle title="学段与显示" />
          <div className="space-y-5">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-main">
                <GraduationCap size={15} className="text-brand-600" /> 当前年级
              </p>
              <div className="flex flex-wrap gap-2">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`rounded-lg border px-4 py-2 text-sm transition ${grade === g ? 'border-brand-500 bg-brand-50 text-brand-700' : 'text-sub hover:bg-black/[0.04]'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  {eyeCare ? <Moon size={16} /> : <Sun size={16} />}
                </span>
                <div>
                  <p className="text-sm font-medium text-main">护眼模式</p>
                  <p className="text-xs text-muted">暖色背景，降低对比度，缓解视疲劳</p>
                </div>
              </div>
              <button
                onClick={() => setEyeCare(!eyeCare)}
                className={`relative h-6 w-11 rounded-full transition ${eyeCare ? 'bg-brand-500' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${eyeCare ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* 学科管理 */}
      <Card>
        <SectionTitle title="学科管理" subtitle="已上线学科可学习，其余接口已预留">
          <span className="flex items-center gap-1.5 text-xs text-sub"><BookOpen size={13} /> 学科</span>
        </SectionTitle>
        <div className="grid-cards-4">
          {SUBJECTS.map((s) => (
            <div key={s.key} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${s.color}1a`, color: s.color }}>
                  <SubjectIcon subjectKey={s.key} size={17} />
                </span>
                <Badge tone={s.enabled ? 'green' : 'gray'}>{s.enabled ? '已上线' : '待开放'}</Badge>
              </div>
              <p className="mt-2.5 text-sm font-medium text-main">{s.name}</p>
              <p className="text-xs text-muted">{s.enabled ? `掌握度 ${s.mastery}%` : '接口已预留'}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 隐私与关于 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle title="隐私与数据">
            <Shield size={13} className="text-sub" />
          </SectionTitle>
          <ul className="space-y-3 text-sm text-sub">
            <li className="flex items-center justify-between">学习数据本地留存 <Badge tone="green">已开启</Badge></li>
            <li className="flex items-center justify-between">弱点档案永久保存 <Badge tone="green">已开启</Badge></li>
            <li className="flex items-center justify-between">数据导出 <Button variant="ghost" size="sm">导出</Button></li>
          </ul>
        </Card>
        <Card>
          <SectionTitle title="关于">
            <Info size={13} className="text-sub" />
          </SectionTitle>
          <p className="text-sm text-sub">学情闭环 · AI 智能试卷分析与弱点靶向训练系统</p>
          <p className="mt-1 text-xs text-muted">v0.1.0 · 闭环：录入→诊断→出题→训练→复盘</p>
          <p className="mt-3 text-xs text-muted">适用：初三 / 高一 / 高二 / 高三 · 全学段全学科个性化提分</p>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-sub">{label}</span>
      <span className={`text-sm font-medium ${muted ? 'text-muted' : 'text-main'}`}>{value}</span>
    </div>
  )
}
