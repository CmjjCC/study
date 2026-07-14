import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Grade, SubjectKey } from '@/types'

interface AppState {
  grade: Grade
  setGrade: (g: Grade) => void
  eyeCare: boolean
  setEyeCare: (v: boolean) => void
  toggleEyeCare: () => void
  /** 当前选中的学科（用于分科主页等），null 表示全部 */
  activeSubject: SubjectKey | null
  setActiveSubject: (s: SubjectKey | null) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [grade, setGrade] = useState<Grade>('高二')
  const [eyeCare, setEyeCare] = useState<boolean>(false)
  const [activeSubject, setActiveSubject] = useState<SubjectKey | null>(null)

  useEffect(() => {
    const root = document.documentElement
    if (eyeCare) root.classList.add('eye-care')
    else root.classList.remove('eye-care')
  }, [eyeCare])

  const value = useMemo<AppState>(
    () => ({
      grade,
      setGrade,
      eyeCare,
      setEyeCare,
      toggleEyeCare: () => setEyeCare((v) => !v),
      activeSubject,
      setActiveSubject,
    }),
    [grade, eyeCare, activeSubject],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
