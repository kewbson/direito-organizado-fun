import { Home, BookOpen, Calendar, ClipboardList, Brain, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const bottomNavItems = [
  { icon: Home, label: 'Home', id: 'dashboard' },
  { icon: BookOpen, label: 'Caderno', id: 'notebook' },
  { icon: ClipboardList, label: 'Planos', id: 'planning' },
  { icon: Brain, label: 'Testes', id: 'tests' },
  { icon: Scale, label: 'Vade Mecum', id: 'vademecum' },
]

export function MobileBottomNav({ activeSection, onSectionChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around items-center py-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center justify-center h-16 w-16 p-1",
                "hover:bg-gray-100",
                isActive && "text-amber-600"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1",
                isActive && "text-amber-600"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive && "text-amber-600"
              )}>
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}

