import { useState } from 'react'
import { FileText, Copy, Star, ChevronRight } from 'lucide-react'
import { Card, Button, Badge, Tag, SubjectIcon } from '@/components/ui'
import { SUBJECTS } from '@/data/mock'
import type { SubjectKey } from '@/types'

interface Tpl {
  id: string
  title: string
  subject: SubjectKey
  category: string
  use: string
  body: string
  tags: string[]
}

const TEMPLATES: Tpl[] = [
  {
    id: 't1',
    title: '议论文「并列递进式」结构',
    subject: 'chinese',
    category: '作文模板',
    use: '适用：稳扎稳打的议论分析',
    body: '引论（提出中心论点）→ 分论一 → 分论二 → 分论三（递进）→ 结论（升华/呼应）。',
    tags: ['议论文', '结构', '递进'],
  },
  {
    id: 't2',
    title: '立体几何建系答题模板',
    subject: 'math',
    category: '解题套路',
    use: '适用：空间角与距离计算',
    body: '①建立空间直角坐标系 ②标出关键点坐标 ③求方向向量/法向量 ④代入夹角公式 ⑤结论。',
    tags: ['立体几何', '空间向量', '建系'],
  },
  {
    id: 't3',
    title: '英语作文「观点+论据」万能段',
    subject: 'english',
    category: '写作模板',
    use: '适用：议论文主体段',
    body: 'Topic sentence + Explanation + Example + Link。开头亮观点，举例支撑，回扣主题。',
    tags: ['英语写作', '段落', '论据'],
  },
  {
    id: 't4',
    title: '电磁感应计算题答题规范',
    subject: 'physics',
    category: '解题套路',
    use: '适用：导体棒切割类综合题',
    body: '受力分析→安培力 F=BIL→动生电动势 E=BLv→收尾 v=mgR/B²L²→能量守恒求 Q。',
    tags: ['电磁感应', '规范', '能量守恒'],
  },
  {
    id: 't5',
    title: '文言文翻译「留删换调补」五步',
    subject: 'chinese',
    category: '解题套路',
    use: '适用：文言翻译题',
    body: '留（专有名词）删（虚词）换（古义今译）调（倒装还原）补（省略补出）。',
    tags: ['文言文', '翻译', '五步法'],
  },
  {
    id: 't6',
    title: '完形填空三遍法',
    subject: 'english',
    category: '解题套路',
    use: '适用：英语完形',
    body: '第一遍通读定主旨，第二遍带空选答案，第三遍代入回读验证。',
    tags: ['完形', '三遍法', '阅读'],
  },
]

const CATS = ['全部', ...Array.from(new Set(TEMPLATES.map((t) => t.category)))]

export default function Templates() {
  const [cat, setCat] = useState('全部')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const list = TEMPLATES.filter((t) => cat === '全部' || t.category === cat)

  return (
    <div className="space-y-6">
      <div className="page-head">
        <div>
          <h1 className="page-title">模板库</h1>
          <p className="page-subtitle">作文模板、解题套路、答题规范，按学科分类取用。</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${cat === c ? 'bg-brand-500 text-white' : 'bg-gray-50 text-sub hover:bg-gray-100'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid-cards">
        {list.map((t) => {
          const sub = SUBJECTS.find((s) => s.key === t.subject)!
          const isOpen = expanded.has(t.id)
          return (
            <Card key={t.id} hover className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${sub.color}1a`, color: sub.color }}>
                  <SubjectIcon subjectKey={t.subject} size={15} />
                </span>
                <Badge tone="gray">{t.category}</Badge>
              </div>
              <h3 className="mt-3 text-base font-semibold text-main">{t.title}</h3>
              <p className="mt-1 text-xs text-muted">{t.use}</p>
              <div className={`mt-3 rounded-lg bg-gray-50/60 p-3 text-sm leading-relaxed text-sub ${isOpen ? '' : 'line-clamp-2'}`}>
                {t.body}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.tags.map((tg) => (
                  <Tag key={tg}>{tg}</Tag>
                ))}
              </div>
              <div className="mt-4 flex gap-2 border-t pt-3">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setExpanded((s) => { const n = new Set(s); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n })}>
                  {isOpen ? '收起' : '展开'} <ChevronRight size={14} className={`transition ${isOpen ? 'rotate-90' : ''}`} />
                </Button>
                <Button variant="outline" size="sm"><Copy size={14} /> 复制</Button>
                <Button variant="ghost" size="sm"><Star size={14} /></Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
