// ====== 全局类型定义 ======

export type Grade = '初三' | '高一' | '高二' | '高三'

export type SubjectKey =
  | 'chinese'
  | 'math'
  | 'english'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'history'
  | 'geography'
  | 'politics'

export interface Subject {
  key: SubjectKey
  name: string
  color: string // tailwind 色板名或 hex
  icon: string // lucide 图标名
  enabled: boolean // 是否已上线该学科
  mastery: number // 掌握度 0-100
}

export type WeaknessType = '基础漏洞' | '题型短板' | '解题思路缺陷' | '应试易错误区'

export type Priority = '高' | '中' | '低'

export interface Weakness {
  id: string
  subject: SubjectKey
  knowledge: string // 知识点
  type: WeaknessType
  priority: Priority
  mastery: number // 掌握度
  loseRate: number // 失分率
  suggestion: string // 提升方案
  sourcePaper?: string // 来源试卷（诊断生成时关联）
}

export interface Question {
  id: string
  subject: SubjectKey
  grade: Grade
  knowledge: string
  type: string // 题型：选择/填空/解答...
  difficulty: 1 | 2 | 3 | 4 | 5
  stem: string
  options?: string[]
  answer: string
  analysis: string
  tags: string[]
}

export interface Mistake {
  id: string
  question: Question
  wrongAnswer: string
  reason: string
  type: WeaknessType
  addedAt: string
  reviewed: boolean
}

export interface ExamPaper {
  id: string
  name: string
  subject: SubjectKey
  grade: Grade
  date: string
  score: number
  total: number
  questionCount: number
  status: '已解析' | '解析中' | '待解析'
}

export interface VocabWord {
  id: string
  word: string
  phonetic: string
  meaning: string
  example: string
  stage: '新词' | '学习中' | '复习中' | '已掌握'
  nextReview: string
}

export interface Material {
  id: string
  title: string
  category: string
  excerpt: string
  tags: string[]
  subject: SubjectKey
}

export interface StudyStat {
  date: string
  minutes: number
  questions: number
  accuracy: number
}
