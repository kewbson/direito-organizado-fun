import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { useDarkMode } from './hooks/useDarkMode'
import { AuthPage } from './components/Auth/AuthPage'
import { Sidebar } from './components/Layout/Sidebar'
import { MobileBottomNav } from './components/Layout/MobileBottomNav'
import { Dashboard } from './components/Sections/Dashboard'
import { DigitalNotebook } from './components/Sections/DigitalNotebook'
import { StudyPlanning } from './components/Sections/StudyPlanning'
import { Calendar } from './components/Sections/Calendar'
import { QuickTests } from './components/Sections/QuickTests'
import { Support } from './components/Sections/Support'
import { Profile } from './components/Sections/Profile'
import VadeMecum from './components/VadeMecum/VadeMecum'
import VadeMecumErrorBoundary from './components/VadeMecum/VadeMecumErrorBoundary'
import './App.css'

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const { isAuthenticated, isLoading } = useAuth()
  const { isDarkMode } = useDarkMode()

  // Aplicar classe dark no body quando o componente monta
  useEffect(() => {
    // Garantir que as classes CSS sejam aplicadas corretamente
    document.body.className = document.body.className.replace(/\s*dark\s*/g, '')
    if (isDarkMode) {
      document.body.classList.add('dark')
    }
  }, [isDarkMode])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="loading-spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar página de login
  if (!isAuthenticated) {
    return <AuthPage />
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'notebook':
        return <DigitalNotebook />
      case 'planning':
        return <StudyPlanning />
      case 'calendar':
        return <Calendar />
      case 'tests':
        return <QuickTests />
      case 'vademecum':
        return (
          <VadeMecumErrorBoundary>
            <VadeMecum />
          </VadeMecumErrorBoundary>
        )
      case 'support':
        return <Support />
      case 'profile':
        return <Profile />
      default:
        return <Dashboard />
    }
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="flex">
          {/* Sidebar - Desktop */}
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            className="hidden md:block"
          />
          
          {/* Sidebar - Mobile */}
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            className="md:hidden"
          />

          {/* Main Content */}
          <main className="flex-1 md:ml-0">
            <div className="p-4 md:p-6 pb-20 md:pb-6">
              {renderSection()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
      </div>
    </DataProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

