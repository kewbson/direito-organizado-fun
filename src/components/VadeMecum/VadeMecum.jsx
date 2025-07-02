import React, { useState, useEffect } from 'react'
import { BookOpen, Plus, BarChart3, Bug } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import VadeMecumSearch from './VadeMecumSearch'
import VadeMecumList from './VadeMecumList'
import VadeMecumViewer from './VadeMecumViewer'
import VadeMecumStats from './VadeMecumStats'
import VadeMecumDebug from './VadeMecumDebug'
import { 
  getAllVadeMecumDocuments, 
  searchVadeMecum, 
  getVadeMecumByType,
  getVadeMecumStats
} from '../../services/vadeMecumService'

const VadeMecum = () => {
  const [documents, setDocuments] = useState([])
  const [filteredDocuments, setFilteredDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('browse')

  // Carregar todos os documentos na inicialização
  useEffect(() => {
    loadAllDocuments()
    loadStats()
  }, [])

  const loadAllDocuments = async () => {
    setLoading(true)
    try {
      const result = await getAllVadeMecumDocuments()
      if (result.success) {
        setDocuments(result.documents)
        setFilteredDocuments(result.documents)
      } else {
        console.error('Erro ao carregar documentos:', result.error)
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const result = await getVadeMecumStats()
      if (result.success) {
        setStats(result.stats)
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredDocuments(documents)
      return
    }

    setSearchLoading(true)
    try {
      const result = await searchVadeMecum(searchTerm)
      if (result.success) {
        setFilteredDocuments(result.documents)
      } else {
        console.error('Erro na busca:', result.error)
      }
    } catch (error) {
      console.error('Erro na busca:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleFilterByType = async (type) => {
    if (!type) {
      setFilteredDocuments(documents)
      return
    }

    setSearchLoading(true)
    try {
      const result = await getVadeMecumByType(type)
      if (result.success) {
        setFilteredDocuments(result.documents)
      } else {
        console.error('Erro no filtro:', result.error)
      }
    } catch (error) {
      console.error('Erro no filtro:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document)
  }

  const handleCloseViewer = () => {
    setSelectedDocument(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Vade Mecum Inteligente</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Acesse rapidamente leis, decretos, portarias e outros documentos legais organizados e pesquisáveis.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Navegar
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Debug
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <VadeMecumSearch
            onSearch={handleSearch}
            onFilterByType={handleFilterByType}
            loading={searchLoading}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredDocuments.length > 0 && (
                <span>
                  Mostrando {filteredDocuments.length} documento(s)
                  {filteredDocuments.length !== documents.length && 
                    ` de ${documents.length} total`
                  }
                </span>
              )}
            </div>
          </div>

          <VadeMecumList
            documents={filteredDocuments}
            onDocumentSelect={handleDocumentSelect}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <VadeMecumStats stats={stats} loading={loading} />
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <VadeMecumDebug />
        </TabsContent>
      </Tabs>

      {/* Visualizador de documento */}
      {selectedDocument && (
        <VadeMecumViewer
          document={selectedDocument}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  )
}

export default VadeMecum

