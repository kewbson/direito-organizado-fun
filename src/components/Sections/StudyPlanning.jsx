import { useState } from 'react'
import { Plus, Edit, Trash2, Calendar, Target, Clock, CheckCircle, AlertCircle, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useData } from '@/contexts/DataContext'

export function StudyPlanning() {
  const { studyPlans, addStudyPlan, updateStudyPlan, deleteStudyPlan, notes } = useData()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    priority: 'media',
    status: 'pendente',
    linkedNotes: []
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNoteSelection = (noteId) => {
    setFormData(prev => ({
      ...prev,
      linkedNotes: prev.linkedNotes.includes(noteId)
        ? prev.linkedNotes.filter(id => id !== noteId)
        : [...prev.linkedNotes, noteId]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.subject.trim() || !formData.dueDate) {
      return
    }

    const planData = {
      ...formData,
      progress: editingId ? studyPlans.find(p => p.id === editingId)?.progress || 0 : 0
    }

    if (editingId) {
      updateStudyPlan(editingId, planData)
      setEditingId(null)
    } else {
      addStudyPlan(planData)
      setIsCreating(false)
    }

    setFormData({
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      priority: 'media',
      status: 'pendente'
    })
  }

  const handleEdit = (plan) => {
    setFormData({
      title: plan.title,
      subject: plan.subject,
      description: plan.description || '',
      dueDate: plan.dueDate,
      priority: plan.priority,
      status: plan.status,
      linkedNotes: plan.linkedNotes || []
    })
    setEditingId(plan.id)
    setIsCreating(true)
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      priority: 'media',
      status: 'pendente',
      linkedNotes: []
    })
    setIsCreating(false)
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este plano de estudo?')) {
      deleteStudyPlan(id)
    }
  }

  const handleProgressUpdate = (id, newProgress) => {
    const plan = studyPlans.find(p => p.id === id)
    if (plan) {
      const status = newProgress === 100 ? 'concluido' : newProgress > 0 ? 'em-andamento' : 'pendente'
      updateStudyPlan(id, { progress: newProgress, status })
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'baixa': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluido': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'em-andamento': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'pendente': return <Circle className="h-4 w-4 text-gray-400" />
      default: return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const isOverdue = (dueDate, status) => {
    return status !== 'concluido' && new Date(dueDate) < new Date()
  }

  const stats = {
    total: studyPlans.length,
    concluidos: studyPlans.filter(p => p.status === 'concluido').length,
    emAndamento: studyPlans.filter(p => p.status === 'em-andamento').length,
    pendentes: studyPlans.filter(p => p.status === 'pendente').length,
    atrasados: studyPlans.filter(p => isOverdue(p.dueDate, p.status)).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
            Planejamento de Estudos
          </h1>
          <p className="text-gray-600">
            Organize seus estudos e acompanhe seu progresso
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.concluidos}</div>
            <div className="text-sm text-gray-600">Concluídos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.emAndamento}</div>
            <div className="text-sm text-gray-600">Em Andamento</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.pendentes}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.atrasados}</div>
            <div className="text-sm text-gray-600">Atrasados</div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de criação/edição */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Editar Plano de Estudo' : 'Novo Plano de Estudo'}
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
                    placeholder="Ex: Direito Civil - Contratos"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Matéria</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Ex: Direito Civil"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data Limite</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva os tópicos que serão estudados..."
                  rows={3}
                />
              </div>
              
              {/* Vinculação com anotações do Caderno Digital */}
              {notes.length > 0 && (
                <div className="space-y-2">
                  <Label>Vincular Anotações do Caderno Digital</Label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3 space-y-2">
                    {notes.map((note) => (
                      <div key={note.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`note-${note.id}`}
                          checked={formData.linkedNotes.includes(note.id)}
                          onChange={() => handleNoteSelection(note.id)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor={`note-${note.id}`} className="flex-1 text-sm cursor-pointer">
                          <span className="font-medium">{note.title}</span>
                          <span className="text-gray-500 ml-2">({note.subject})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {formData.linkedNotes.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {formData.linkedNotes.length} anotação(ões) selecionada(s)
                    </p>
                  )}
                </div>
              )}
              <div className="flex space-x-2">
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  {editingId ? 'Salvar Alterações' : 'Criar Plano'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de planos */}
      {studyPlans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum plano de estudo criado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece criando seu primeiro plano de estudos
            </p>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar primeiro plano
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {studyPlans.map((plan) => (
            <Card key={plan.id} className={`hover:shadow-md transition-shadow ${
              isOverdue(plan.dueDate, plan.status) ? 'border-red-200 bg-red-50' : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(plan.status)}
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      {isOverdue(plan.dueDate, plan.status) && (
                        <Badge variant="destructive" className="text-xs">
                          Atrasado
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary">{plan.subject}</Badge>
                      <Badge className={getPriorityColor(plan.priority)}>
                        {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(plan.dueDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {plan.description && (
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                )}
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm text-gray-500">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                  <div className="flex space-x-2">
                    {[0, 25, 50, 75, 100].map((value) => (
                      <Button
                        key={value}
                        size="sm"
                        variant={plan.progress === value ? "default" : "outline"}
                        onClick={() => handleProgressUpdate(plan.id, value)}
                        className="text-xs"
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

