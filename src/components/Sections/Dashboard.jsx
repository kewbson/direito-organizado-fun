import { useState, useEffect } from 'react'
import { Calendar, BookOpen, Target, TrendingUp, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useData } from '@/contexts/DataContext'

const motivationalQuotes = [
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "A persistência é o caminho do êxito.",
  "Cada dia é uma nova oportunidade de crescer.",
  "O conhecimento é a única coisa que ninguém pode tirar de você.",
  "Grandes conquistas requerem grandes ambições."
]

export function Dashboard() {
  const [currentQuote, setCurrentQuote] = useState('')
  const { notes, events, studyPlans } = useData()

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setCurrentQuote(randomQuote)
  }, [])

  // Calcular próximos eventos (próximos 7 dias)
  const getUpcomingEvents = () => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= today && eventDate <= nextWeek
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  // Calcular anotações recentes (últimos 7 dias)
  const getRecentNotes = () => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    return notes.filter(note => {
      const noteDate = new Date(note.lastModified || note.date)
      return noteDate >= sevenDaysAgo
    }).sort((a, b) => new Date(b.lastModified || b.date) - new Date(a.lastModified || a.date))
  }

  // Calcular metas do mês (planos de estudo)
  const getMonthlyGoals = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyPlans = studyPlans.filter(plan => {
      const planDate = new Date(plan.dueDate)
      return planDate.getMonth() === currentMonth && planDate.getFullYear() === currentYear
    })
    
    const completedPlans = monthlyPlans.filter(plan => plan.status === 'concluido')
    
    return {
      total: monthlyPlans.length,
      completed: completedPlans.length
    }
  }

  // Calcular progresso geral
  const getOverallProgress = () => {
    if (studyPlans.length === 0) return 0
    
    const totalProgress = studyPlans.reduce((sum, plan) => sum + (plan.progress || 0), 0)
    return Math.round(totalProgress / studyPlans.length)
  }

  const upcomingEvents = getUpcomingEvents()
  const recentNotes = getRecentNotes()
  const monthlyGoals = getMonthlyGoals()
  const overallProgress = getOverallProgress()

  // Atividades recentes combinadas
  const getRecentActivities = () => {
    const activities = []
    
    // Adicionar eventos recentes
    upcomingEvents.slice(0, 2).forEach(event => {
      activities.push({
        type: 'event',
        title: event.title,
        description: `Evento agendado para ${new Date(event.date).toLocaleDateString('pt-BR')}`,
        time: event.date,
        icon: Calendar,
        color: 'blue'
      })
    })
    
    // Adicionar anotações recentes
    recentNotes.slice(0, 2).forEach(note => {
      activities.push({
        type: 'note',
        title: note.title,
        description: `Anotação em ${note.subject}`,
        time: note.lastModified || note.date,
        icon: BookOpen,
        color: 'green'
      })
    })
    
    // Ordenar por data mais recente
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 3)
  }

  const recentActivities = getRecentActivities()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
          Painel de Controle
        </h1>
        <p className="text-gray-600">
          Bem-vindo(a) de volta! Aqui está um resumo do seu dia.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingEvents.length === 0 
                ? "Nenhum evento futuro" 
                : `Próximos 7 dias`
              }
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimas Anotações</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentNotes.length}</div>
            <p className="text-xs text-muted-foreground">
              {recentNotes.length === 0 
                ? "Nenhuma anotação recente" 
                : `Últimos 7 dias`
              }
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas do Mês</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyGoals.completed}/{monthlyGoals.total}</div>
            <p className="text-xs text-muted-foreground">
              Metas concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Média dos planos de estudo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Motivação do Dia */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-700">
              <Target className="h-5 w-5 mr-2" />
              Motivação do Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 italic text-lg text-center">
              "{currentQuote}"
            </p>
          </CardContent>
        </Card>

        {/* Desafie seu Conhecimento */}
       
      </div>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Suas últimas ações na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const Icon = activity.icon
                const timeAgo = new Date(activity.time).toLocaleDateString('pt-BR')
                
                return (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.color === 'blue' ? 'bg-blue-500' : 
                      activity.color === 'green' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                    <Icon className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{timeAgo}</span>
                  </div>
                )
              })
            ) : (
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Bem-vindo à plataforma!</p>
                  <p className="text-xs text-gray-500">Comece explorando as funcionalidades</p>
                </div>
                <span className="text-xs text-gray-400">Agora</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

