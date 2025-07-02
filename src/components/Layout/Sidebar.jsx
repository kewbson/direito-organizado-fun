import { useState } from 'react'
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Brain, 
  HelpCircle, 
  User, 
  LogOut,
  Menu,
  X,
  Scale
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'notebook', label: 'Caderno Digital', icon: BookOpen },
  { id: 'planning', label: 'Planejamento', icon: Calendar },
  { id: 'calendar', label: 'Agenda', icon: Calendar },
  { id: 'tests', label: 'Testes Rápidos', icon: Brain },
  { id: 'vademecum', label: 'Vade Mecum', icon: Scale },
  { id: 'support', label: 'Suporte', icon: HelpCircle },
  { id: 'profile', label: 'Meu Perfil', icon: User },
]

export function Sidebar({ activeSection, onSectionChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId)
    setIsOpen(false) // Fechar sidebar no mobile após seleção
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-md"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${className}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-2 border-b border-gray-700"></div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-amber-700">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-300 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSectionChange(item.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg
                        text-left transition-colors duration-200
                        ${isActive 
                          ? 'bg-amber-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg
                       text-gray-300 hover:bg-red-600 hover:text-white
                       transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}