import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react'
import type { ExamPaper, Grade, Mistake, Weakness, SubjectKey, FavoriteItem, StudyLog, StudyStat } from '@/types'
import { useApp } from './AppContext'
import { DIAGNOSTIC_POOL, QUESTION_BANK } from '@/data/mock'

/**
 * 用户数据全部默认为空 —— 未使用前不展示任何虚假信息。
 * - 试卷 / 弱点 / 错题：按年级隔离，录入试卷后生成。
 * - 收藏 / 学习记录 / 单词进度：全局，由用户行为产生。
 * - 学科掌握度：运行时由当前年级弱点档案计算，无弱点则无数据。
 */
type VocabStage = '新词' | '学习中' | '复习中' | '已掌握'

interface GradeBucket {
  papers: ExamPaper[]
  weaknesses: Weakness[]
  mistakes: Mistake[]
}

const ALL_GRADES: Grade[] = ['初三', '高一', '高二', '高三']
const emptyBucket = (): GradeBucket => ({ papers: [], weaknesses: [], mistakes: [] })

function initByGrade(): Record<Grade, GradeBucket> {
  return ALL_GRADES.reduce((acc, g) => {
    acc[g] = emptyBucket()
    return acc
  }, {} as Record<Grade, GradeBucket>)
}

interface Store {
  byGrade: Record<Grade, GradeBucket>
  favorites: FavoriteItem[]
  studyLog: StudyLog[]
  vocabBook: string | null
  vocabProgress: Record<string, VocabStage>
}

interface DataContextValue {
  /** 当前年级的试卷 */
  papers: ExamPaper[]
  /** 当前年级的弱点 */
  weaknesses: Weakness[]
  /** 当前年级的错题 */
  mistakes: Mistake[]
  /** 收藏（全局） */
  favorites: FavoriteItem[]
  /** 学习记录（全局） */
  studyLog: StudyLog[]
  /** 已选单词书 */
  vocabBook: string | null
  /** 单词学习进度 */
  vocabProgress: Record<string, VocabStage>
  /** 录入试卷 + AI 诊断：生成弱点与错题，写入该试卷所属年级桶 */
  addDiagnosis: (paper: ExamPaper, subject: SubjectKey) => void
  toggleMistakeReviewed: (id: string) => void
  resolveWeakness: (id: string) => void
  /** 收藏 / 取消收藏 */
  toggleFavorite: (item: FavoriteItem) => void
  isFavorite: (kind: FavoriteItem['kind'], refId: string) => boolean
  /** 记录一次学习（训练提交等），同日累加 */
  addStudyLog: (entry: StudyLog) => void
  /** 学习记录按日期聚合为图表数据 */
  studyStats: StudyStat[]
  /** 选择单词书 */
  setVocabBook: (id: string) => void
  /** 设置单词学习阶段 */
  setVocabStage: (wordId: string, stage: VocabStage) => void
  /** 学科掌握度（当前年级弱点档案计算，无弱点返回 null） */
  subjectMastery: (subject: SubjectKey) => number | null
}

const Ctx = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { grade } = useApp()
  const [store, setStore] = useState<Store>({
    byGrade: initByGrade(),
    favorites: [],
    studyLog: [],
    vocabBook: null,
    vocabProgress: {},
  })

  const addDiagnosis = useCallback((paper: ExamPaper, subject: SubjectKey) => {
    setStore((prev) => {
      const bucket = prev.byGrade[paper.grade]
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
        byGrade: {
          ...prev.byGrade,
          [paper.grade]: {
            papers: [...bucket.papers, paper],
            weaknesses: [...bucket.weaknesses, ...weaknesses],
            mistakes: [...bucket.mistakes, ...mistakes],
          },
        },
      }
    })
  }, [])

  const toggleMistakeReviewed = useCallback((id: string) => {
    setStore((prev) => {
      const bucket = prev.byGrade[grade]
      return {
        ...prev,
        byGrade: {
          ...prev.byGrade,
          [grade]: {
            ...bucket,
            mistakes: bucket.mistakes.map((m) =>
              m.id === id ? { ...m, reviewed: !m.reviewed } : m,
            ),
          },
        },
      }
    })
  }, [grade])

  const resolveWeakness = useCallback((id: string) => {
    setStore((prev) => {
      const bucket = prev.byGrade[grade]
      return {
        ...prev,
        byGrade: {
          ...prev.byGrade,
          [grade]: { ...bucket, weaknesses: bucket.weaknesses.filter((w) => w.id !== id) },
        },
      }
    })
  }, [grade])

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setStore((prev) => {
      const exists = prev.favorites.some((f) => f.kind === item.kind && f.refId === item.refId)
      return {
        ...prev,
        favorites: exists
          ? prev.favorites.filter((f) => !(f.kind === item.kind && f.refId === item.refId))
          : [...prev.favorites, item],
      }
    })
  }, [])

  const addStudyLog = useCallback((entry: StudyLog) => {
    setStore((prev) => {
      const idx = prev.studyLog.findIndex((e) => e.date === entry.date)
      if (idx >= 0) {
        const cur = prev.studyLog[idx]
        const merged: StudyLog = {
          date: entry.date,
          minutes: cur.minutes + entry.minutes,
          questions: cur.questions + entry.questions,
          correct: cur.correct + entry.correct,
        }
        const log = [...prev.studyLog]
        log[idx] = merged
        return { ...prev, studyLog: log }
      }
      return { ...prev, studyLog: [...prev.studyLog, entry] }
    })
  }, [])

  const setVocabBook = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, vocabBook: id }))
  }, [])

  const setVocabStage = useCallback((wordId: string, stage: VocabStage) => {
    setStore((prev) => ({ ...prev, vocabProgress: { ...prev.vocabProgress, [wordId]: stage } }))
  }, [])

  const bucket = store.byGrade[grade]

  const studyStats = useMemo<StudyStat[]>(() => {
    return store.studyLog
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map((e) => ({
        date: e.date.slice(5).replace('-', '/'),
        minutes: e.minutes,
        questions: e.questions,
        accuracy: e.questions ? Math.round((e.correct / e.questions) * 100) : 0,
      }))
  }, [store.studyLog])

  const subjectMastery = useCallback(
    (subject: SubjectKey): number | null => {
      const ws = store.byGrade[grade].weaknesses.filter((w) => w.subject === subject)
      if (ws.length === 0) return null
      return Math.round(ws.reduce((a, w) => a + w.mastery, 0) / ws.length)
    },
    [store.byGrade, grade],
  )

  const value = useMemo<DataContextValue>(
    () => ({
      papers: bucket.papers,
      weaknesses: bucket.weaknesses,
      mistakes: bucket.mistakes,
      favorites: store.favorites,
      studyLog: store.studyLog,
      vocabBook: store.vocabBook,
      vocabProgress: store.vocabProgress,
      addDiagnosis,
      toggleMistakeReviewed,
      resolveWeakness,
      toggleFavorite,
      isFavorite: (kind, refId) => store.favorites.some((f) => f.kind === kind && f.refId === refId),
      addStudyLog,
      studyStats,
      setVocabBook,
      setVocabStage,
      subjectMastery,
    }),
    [bucket, store.favorites, store.studyLog, store.vocabBook, store.vocabProgress, addDiagnosis, toggleMistakeReviewed, resolveWeakness, toggleFavorite, addStudyLog, studyStats, setVocabBook, setVocabStage, subjectMastery],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useData() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
