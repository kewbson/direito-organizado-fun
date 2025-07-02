import React from 'react'
import { X, Calendar, Tag, FileText, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { useState } from 'react'

const VadeMecumViewer = ({ document, onClose }) => {
  const [copied, setCopied] = useState(false)

  const formatDate = (date) => {
    if (!date) return 'Data não disponível'
    
    let dateObj
    if (date.toDate) {
      // Firestore Timestamp
      dateObj = date.toDate()
    } else if (date instanceof Date) {
      dateObj = date
    } else {
      dateObj = new Date(date)
    }
    
    return dateObj.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTypeLabel = (type) => {
    const typeLabels = {
      'constituicao': 'Constituição',
      'lei': 'Lei',
      'decreto': 'Decreto',
      'portaria': 'Portaria',
      'resolucao': 'Resolução',
      'instrucao_normativa': 'Instrução Normativa',
      'medida_provisoria': 'Medida Provisória',
      'emenda_constitucional': 'Emenda Constitucional',
      'codigo': 'Código',
      'sumula': 'Súmula'
    }
    return typeLabels[type] || type
  }

  const getTypeColor = (type) => {
    const typeColors = {
      'constituicao': 'bg-red-100 text-red-800',
      'lei': 'bg-blue-100 text-blue-800',
      'decreto': 'bg-green-100 text-green-800',
      'portaria': 'bg-yellow-100 text-yellow-800',
      'resolucao': 'bg-purple-100 text-purple-800',
      'instrucao_normativa': 'bg-indigo-100 text-indigo-800',
      'medida_provisoria': 'bg-orange-100 text-orange-800',
      'emenda_constitucional': 'bg-pink-100 text-pink-800',
      'codigo': 'bg-gray-100 text-gray-800',
      'sumula': 'bg-cyan-100 text-cyan-800'
    }
    return typeColors[type] || 'bg-gray-100 text-gray-800'
  }

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(document.conteudo)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar conteúdo:', err)
    }
  }

  const formatContent = (content) => {
    if (!content) return ''
    
    // Quebra o conteúdo em parágrafos e adiciona formatação básica
    return content
      .split('\n\n')
      .map((paragraph, index) => (
        <p key={index} className="mb-4 text-justify leading-relaxed">
          {paragraph.trim()}
        </p>
      ))
  }

  if (!document) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <CardTitle className="text-xl mb-3 leading-tight">
                {document.titulo}
              </CardTitle>
              
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={getTypeColor(document.tipo)}>
                  {getTypeLabel(document.tipo)}
                </Badge>
                
                {document.referencia && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm font-medium text-gray-700">
                      {document.referencia}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6">
            <div className="space-y-6">
              {/* Metadados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                {document.dataCriacao && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Criado em:</span>
                    <span className="font-medium">{formatDate(document.dataCriacao)}</span>
                  </div>
                )}
                
                {document.dataAtualizacao && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Atualizado em:</span>
                    <span className="font-medium">{formatDate(document.dataAtualizacao)}</span>
                  </div>
                )}
              </div>

              {/* Palavras-chave */}
              {document.palavrasChave && document.palavrasChave.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Palavras-chave:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {document.palavrasChave.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Conteúdo */}
              {document.conteudo && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Conteúdo:</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyContent}
                      className="text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-white border rounded-lg p-6">
                      {formatContent(document.conteudo)}
                    </div>
                  </div>
                </div>
              )}

              {/* Seções (se houver) */}
              {document.secoes && document.secoes.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Seções:</h3>
                  <div className="space-y-4">
                    {document.secoes.map((secao, index) => (
                      <Card key={index} className="border-l-4 border-blue-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{secao.titulo}</CardTitle>
                          {secao.referencia && (
                            <p className="text-sm text-gray-600">{secao.referencia}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          {formatContent(secao.conteudo)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default VadeMecumViewer

