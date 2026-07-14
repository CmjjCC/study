import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import Subjects from '@/pages/Subjects'
import PaperUpload from '@/pages/PaperUpload'
import WeaknessReport from '@/pages/WeaknessReport'
import Training from '@/pages/Training'
import MistakeBook from '@/pages/MistakeBook'
import Vocab from '@/pages/Vocab'
import Materials from '@/pages/Materials'
import Templates from '@/pages/Templates'
import Favorites from '@/pages/Favorites'
import Stats from '@/pages/Stats'
import SettingsPage from '@/pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="paper-upload" element={<PaperUpload />} />
        <Route path="weakness" element={<WeaknessReport />} />
        <Route path="training" element={<Training />} />
        <Route path="mistakes" element={<MistakeBook />} />
        <Route path="vocab" element={<Vocab />} />
        <Route path="materials" element={<Materials />} />
        <Route path="templates" element={<Templates />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="stats" element={<Stats />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
