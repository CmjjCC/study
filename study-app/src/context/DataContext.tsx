import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react'
import type { ExamPaper, Grade, Mistake, Weakness, SubjectKey } from '@/types'
import { useApp } from './AppContext'
import { DIAGNOSTIC_POOL, QUESTION_BANK } from '@/data/mock'

/**
 * 用户数据（试卷 / 弱点 / 错题）按年级隔离存储。
 * 默认全部为空 —— 未上传信息时不展示任何预置弱项，仅引导录入。
 * 切换年级时，读取对应年级桶的数据（可能为空）。
 */
interface GradeBucket {
  papers: ExamPaper[]
  weaknesses: Weakness[]
  mistakes: Mistake[]
}

const ALL_GRADES: Grade[] = ['初三', '高一', '高二', '高三']

const emptyBucket = (): GradeBucket => ({ papers: [], weaknesses: [], mistakes: [] })

function initStore(): Record<Grade, GradeBucket> {
  return ALL_GRADES.reduce((acc, g) => {
    acc[g] = emptyBucket()
    return acc
  }, {} as Record<Grade, GradeBucket>)
}

interface DataContextValue {
  /** 当前年级的试卷 */
  papers: ExamPaper[]
  /** 当前年级的弱点 */
  weaknesses: Weakness[]
  /** 当前年级的错题 */
  mistakes: Mistake[]
  /** 录入试卷 + AI 诊断：生成弱点与错题，写入该试卷所属年级桶 */
  addDiagnosis: (paper: ExamPaper, subject: SubjectKey) => void
  /** 切换错题复习状态 */
  toggleMistakeReviewed: (id: string) => void
  /** 移除某弱点（掌握后归档） */
  resolveWeakness: (id: string) => void
}

const Ctx = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { grade } = useApp()
  const [store, setStore] = useState<Record<Grade, GradeBucket>>(initStore)

  const addDiagnosis = useCallback((paper: ExamPaper, subject: SubjectKey) => {
    setStore((prev) => {
      const bucket = prev[paper.grade]
      const pool = DIAGNOSTIC_POOL.filter((w) => w.subject === subject)
      const stamp = Date.now()
      const weaknesses: Weakness[] = pool.map((w, i) => ({
        ...w,
        id: `${paper.id}-w${i}-${stamp}`,
        sourcePaper: paper.name,
      }))
      const qs = QUESTION_BANK.filter((q) => q.subject === subject && q.grade === paper.grade)
      const qPool = qs.length ? qs : QUESTION_BANK.filter((q) => q.subject === subject)
      const mistakes: Mistake[] = qPool.slice(0, Math.min(2, qPool.length)).map((q, i) => {
        let wrong = '（错答示例）'
        if (q.options) {
          const correctIdx = q.answer.charCodeAt(0) - 65
          const wrongIdx = q.options.findIndex((_, idx) => idx !== correctIdx)
          if (wrongIdx >= 0) wrong = `${String.fromCharCode(65 + wrongIdx)}. ${q.options[wrongIdx]}`
        }
        const wRef = weaknesses[i % Math.max(weaknesses.length, 1)]
        return {
          id: `${paper.id}-m${i}-${stamp}`,
          question: q,
          wrongAnswer: wrong,
          reason: wRef?.suggestion ?? '需强化该知识点',
          type: wRef?.type ?? '基础漏洞',
          addedAt: paper.date,
          reviewed: false,
        }
      })
      return {
        ...prev,
        [paper.grade]: {
          papers: [...bucket.papers, paper],
          weaknesses: [...bucket.weaknesses, ...weaknesses],
          mistakes: [...bucket.mistakes, ...mistakes],
        },
      }
    })
  }, [])

  const toggleMistakeReviewed = useCallback((id: string) => {
    setStore((prev) => {
      const bucket = prev[grade]
      return {
        ...prev,
        [grade]: {
          ...bucket,
          mistakes: bucket.mistakes.map((m) =>
            m.id === id ? { ...m, reviewed: !m.reviewed } : m,
          ),
        },
      }
    })
  }, [grade])

  const resolveWeakness = useCallback((id: string) => {
    setStore((prev) => {
      const bucket = prev[grade]
      return {
        ...prev,
        [grade]: { ...bucket, weaknesses: bucket.weaknesses.filter((w) => w.id !== id) },
      }
    })
  }, [grade])

  const bucket = store[grade]
  const value = useMemo<DataContextValue>(
    () => ({
      papers: bucket.papers,
      weaknesses: bucket.weaknesses,
      mistakes: bucket.mistakes,
      addDiagnosis,
      toggleMistakeReviewed,
      resolveWeakness,
    }),
    [bucket, addDiagnosis, toggleMistakeReviewed, resolveWeakness],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useData() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
