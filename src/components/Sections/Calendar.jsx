import { useState } from 'react'
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Clock, BookOpen, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useData } from '@/contexts/DataContext'

export function Calendar() {
  const { events, addEvent, updateEvent, deleteEvent } = useData()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: 'aula',
    description: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.date || !formData.time) {
      return
    }

    if (editingId) {
      updateEvent(editingId, formData)
      setEditingId(null)
    } else {
      addEvent(formData)
      setIsCreating(false)
    }

    setFormData({
      title: '',
      date: '',
      time: '',
      type: 'aula',
      description: ''
    })
  }

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      description: event.description || ''
    })
    setEditingId(event.id)
    setIsCreating(true)
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      type: 'aula',
      description: ''
    })
    setIsCreating(false)
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      deleteEvent(id)
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'prova': return 'bg-red-100 text-red-800'
      case 'aula': return 'bg-blue-100 text-blue-800'
      case 'estudo': return 'bg-green-100 text-green-800'
      case 'prazo': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'prova': return <AlertCircle className="h-4 w-4" />
      case 'aula': return <BookOpen className="h-4 w-4" />
      case 'estudo': return <CheckCircle className="h-4 w-4" />
      case 'prazo': return <Clock className="h-4 w-4" />
      default: return <CalendarIcon className="h-4 w-4" />
    }
  }

  // Filtrar eventos por data selecionada
  const eventsForSelectedDate = events.filter(event => event.date === selectedDate)

  // Obter próximos eventos (próximos 7 dias a partir de hoje)
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate >= today && eventDate <= nextWeek
  }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))

  // Obter os 2 próximos eventos mais próximos da data atual
  const getNextTwoEvents = () => {
    const now = new Date()
    return events.filter(event => {
      const eventDateTime = new Date(event.date + ' ' + event.time)
      return eventDateTime >= now
    }).sort((a, b) => {
      const dateTimeA = new Date(a.date + ' ' + a.time)
      const dateTimeB = new Date(b.date + ' ' + b.time)
      return dateTimeA - dateTimeB
    }).slice(0, 2)
  }

  const nextTwoEvents = getNextTwoEvents()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return timeString.slice(0, 5) // Remove seconds if present
  }

  const isToday = (dateString) => {
    return dateString === new Date().toISOString().split('T')[0]
  }

  const isPast = (dateString, timeString) => {
    const eventDateTime = new Date(dateString + ' ' + timeString)
    return eventDateTime < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
            Agenda
          </h1>
          <p className="text-gray-600">
            Organize suas aulas, provas e prazos
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seletor de Data e Eventos do Dia */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date Picker */}
          <Card>
            <CardHeader>
              <CardTitle>Selecione um dia</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Formulário de criação/edição */}
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId ? 'Editar Evento' : 'Novo Evento'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Ex: Prova de Direito Civil"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="aula">Aula</option>
                        <option value="prova">Prova</option>
                        <option value="estudo">Sessão de Estudo</option>
                        <option value="prazo">Prazo</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Horário</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detalhes sobre o evento..."
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                      {editingId ? 'Salvar Alterações' : 'Criar Evento'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Eventos do Dia Selecionado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {formatDate(selectedDate)}
                {isToday(selectedDate) && (
                  <Badge className="ml-2 bg-amber-100 text-amber-800">Hoje</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {eventsForSelectedDate.length} evento(s) neste dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventsForSelectedDate.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum evento neste dia</p>
                  <Button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, date: selectedDate }))
                      setIsCreating(true)
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar evento
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsForSelectedDate
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((event) => (
                    <div 
                      key={event.id} 
                      className={`p-4 border rounded-lg ${
                        isPast(event.date, event.time) ? 'bg-gray-50 opacity-75' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(event.type)}
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge className={getTypeColor(event.type)}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                            {isPast(event.date, event.time) && (
                              <Badge variant="secondary">Finalizado</Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(event.time)}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600">{event.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Próximos Eventos */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>
                Os 2 eventos mais próximos da data atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nextTwoEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhum evento próximo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {nextTwoEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        {getTypeIcon(event.type)}
                        <h5 className="font-medium text-sm">{event.title}</h5>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('pt-BR', {
                          month: 'short',
                          day: 'numeric'
                        })} às {formatTime(event.time)}
                      </div>
                      <Badge className={`${getTypeColor(event.type)} text-xs mt-1`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Total de Eventos</span>
                </div>
                <span className="font-medium">{events.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Provas</span>
                </div>
                <span className="font-medium">
                  {events.filter(e => e.type === 'prova').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Aulas</span>
                </div>
                <span className="font-medium">
                  {events.filter(e => e.type === 'aula').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Próximos 7 dias</span>
                </div>
                <span className="font-medium">{upcomingEvents.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

