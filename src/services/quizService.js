import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore'
import { db } from '../firebase/config'

// Coleção de quizzes no Firestore
const QUIZZES_COLLECTION = 'quizzes'

// Função para salvar resultado de teste
export const saveTestResult = async (userId, testResult) => {
  try {
    const testData = {
      userId,
      subject: testResult.subject,
      score: testResult.score,
      totalQuestions: testResult.totalQuestions,
      correctAnswers: testResult.correctAnswers,
      duration: testResult.duration,
      date: new Date().toISOString(),
      timestamp: new Date()
    }

    const docRef = await addDoc(collection(db, QUIZZES_COLLECTION), testData)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Erro ao salvar resultado do teste:', error)
    return { success: false, error: error.message }
  }
}

// Função para buscar resultados de testes do usuário
export const getUserTestResults = async (userId) => {
  try {
    const q = query(
      collection(db, QUIZZES_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const results = []
    
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return { success: true, data: results }
  } catch (error) {
    console.error('Erro ao buscar resultados dos testes:', error)
    return { success: false, error: error.message }
  }
}

// Função para buscar estatísticas do usuário
export const getUserStats = async (userId) => {
  try {
    const q = query(
      collection(db, QUIZZES_COLLECTION),
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    const results = []
    
    querySnapshot.forEach((doc) => {
      results.push(doc.data())
    })
    
    // Calcular estatísticas
    const stats = {
      totalTests: results.length,
      averageScore: 0,
      bestScore: 0,
      subjectStats: {}
    }
    
    if (results.length > 0) {
      const totalScore = results.reduce((sum, result) => sum + result.score, 0)
      stats.averageScore = Math.round(totalScore / results.length)
      stats.bestScore = Math.max(...results.map(result => result.score))
      
      // Estatísticas por matéria
      results.forEach(result => {
        if (!stats.subjectStats[result.subject]) {
          stats.subjectStats[result.subject] = {
            count: 0,
            totalScore: 0,
            bestScore: 0
          }
        }
        
        stats.subjectStats[result.subject].count++
        stats.subjectStats[result.subject].totalScore += result.score
        stats.subjectStats[result.subject].bestScore = Math.max(
          stats.subjectStats[result.subject].bestScore, 
          result.score
        )
      })
      
      // Calcular média por matéria
      Object.keys(stats.subjectStats).forEach(subject => {
        const subjectData = stats.subjectStats[subject]
        subjectData.averageScore = Math.round(subjectData.totalScore / subjectData.count)
      })
    }
    
    return { success: true, data: stats }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return { success: false, error: error.message }
  }
}

// Função para buscar melhores resultados recentes
export const getRecentBestResults = async (userId, limitCount = 5) => {
  try {
    const q = query(
      collection(db, QUIZZES_COLLECTION),
      where('userId', '==', userId),
      orderBy('score', 'desc'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const results = []
    
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return { success: true, data: results }
  } catch (error) {
    console.error('Erro ao buscar melhores resultados:', error)
    return { success: false, error: error.message }
  }
}

// Função para deletar resultado de teste
export const deleteTestResult = async (resultId) => {
  try {
    await deleteDoc(doc(db, QUIZZES_COLLECTION, resultId))
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar resultado:', error)
    return { success: false, error: error.message }
  }
}

// Função para buscar resultados por matéria
export const getTestResultsBySubject = async (userId, subject) => {
  try {
    const q = query(
      collection(db, QUIZZES_COLLECTION),
      where('userId', '==', userId),
      where('subject', '==', subject),
      orderBy('timestamp', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const results = []
    
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return { success: true, data: results }
  } catch (error) {
    console.error('Erro ao buscar resultados por matéria:', error)
    return { success: false, error: error.message }
  }
}

