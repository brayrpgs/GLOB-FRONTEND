import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonSpinner,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonBadge,
  IonText,
  IonInput
} from '@ionic/react'
import { informationCircleOutline, send, sparklesOutline, closeCircle } from 'ionicons/icons'
import { RequestHelper } from '../../Helpers/RequestHelper'
import { METHOD_HTTP, RESPONSE_TYPE } from '../../Helpers/FetchHelper'
import { ANALYZE_PROJECT_BY_AI_URL, QUERY_PROJECT_BY_AI_URL } from '../../common/Common'
import styles from '../../styles/ai-feedback/style.module.css'
import type { ProjectAnalysisResponse } from '../../models/ProjectAnalysisResponse'
import { AnalizeUtils } from '../../utils/AnalizeUtils'

interface AIFeedbackModalProps {
  projectId?: number
}

// Q&A entry interface
interface QAEntry {
  question: string
  answer: string
  isStreaming?: boolean
}

function isDateExpired(timestamp: Date): boolean {
  const currentDate = Date.now()
  const prevTime = timestamp.getTime()
  const diff = currentDate - prevTime
  const oneHour = 1 * 60 * 60 * 1000
  return diff > oneHour
}

// Helper to safely update last QA entry
const updateLastQA = (prev: QAEntry[], updater: (entry: QAEntry) => QAEntry): QAEntry[] => {
  if (prev.length === 0) return prev
  const copy = [...prev]
  const lastIndex = copy.length - 1
  copy[lastIndex] = updater(copy[lastIndex])
  return copy
}

// Subcomponent: Project overview + general info cards
const ProjectCards: React.FC<{ data: ProjectAnalysisResponse }> = ({ data }) => {
  const generalCard = useMemo(() => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>General</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList lines="none">
          <IonItem>
            <IonLabel>
              <h3>Project</h3>
              <p>{data.project_name}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Team Size</h3>
              <p>{data.team_size} members</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Total Issues</h3>
              <p>{data.total_issues}</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  ), [data])

  const overviewCard = useMemo(() => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Overview</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList lines="inset">
          <IonItem>
            <IonLabel className="ion-text-wrap">
              <h3>Summary</h3>
              <p>{data.analysis.summary}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <h3>Status</h3>
              <p>{data.analysis.health.overallStatus}</p>
            </IonLabel>
            <IonIcon
              icon={informationCircleOutline}
              title={data.analysis.health.explanation}
              slot="end"
            />
          </IonItem>

          <IonItem>
            <IonLabel className="ion-text-wrap">
              <h3>Productivity</h3>
              <p>
                {data.analysis.productivity
                  ? data.analysis.productivity.averageProductivity
                    ? `${data.analysis.productivity.averageProductivity} (${data.analysis.productivity.notes})`
                    : data.analysis.productivity.notes
                      ? data.analysis.productivity.notes
                      : 'Productivity can not be measured'
                  : 'Productivity can not be measured'
                }
              </p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel className="ion-text-wrap">
              <h3>Issues Overview</h3>
              <p>{data.analysis.issues.overview}</p>
            </IonLabel>
          </IonItem>

          {data.analysis.issues.bottlenecks?.length ? (
            <IonItem>
              <IonLabel className="ion-text-wrap">
                <h3>Bottlenecks</h3>
                {data.analysis.issues.bottlenecks.map((b, i) => (
                  <p key={i}>• {b}</p>
                ))}
              </IonLabel>
            </IonItem>
          ) : null}

          <IonItem>
            <IonLabel>
              <h3>Overdue Issues</h3>
            </IonLabel>
            <IonBadge color="danger" slot="end">
              {data.analysis.issues.overdueCount}
            </IonBadge>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  ), [data])

  const risksCard = useMemo(() => (
    data.analysis.risks?.length ? (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Risks</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList lines="none">
            {data.analysis.risks.map((risk, i) => (
              <IonItem key={i}>
                <IonLabel className="ion-text-wrap">
                  <p>• {risk}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    ) : null
  ), [data])

  const recommendationsCard = useMemo(() => (
    data.analysis.recommendations?.length ? (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Recommendations</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList lines="none">
            {data.analysis.recommendations.map((rec, i) => (
              <IonItem key={i}>
                <IonLabel className="ion-text-wrap">
                  <p>• {rec}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    ) : null
  ), [data])

  return (
    <>
      {generalCard}
      {overviewCard}
      {risksCard}
      {recommendationsCard}
    </>
  )
}

// Subcomponent: Chat with AI
const ChatWithAI: React.FC<{
  projectId: number
  qaHistory: QAEntry[]
  updateQaHistory: (updater: (prev: QAEntry[]) => QAEntry[]) => void
  questionLoading: boolean
  questionError: string | null
  question: string
  setQuestion: (q: string) => void
  handleAskQuestion: () => Promise<void>
  handleCancelQuestion: () => void
}> = ({ projectId, qaHistory, updateQaHistory, questionLoading, questionError, question, setQuestion, handleAskQuestion, handleCancelQuestion }) => {
  const chatRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    const el = chatRef.current
    if (!el) return
    // scroll to bottom 
    el.scrollTo({ top: el.scrollHeight })
  }, [qaHistory])

  // Only show last N entries to avoid performance issues
  const visibleHistory = useMemo(() => qaHistory.slice(-50), [qaHistory])

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Chat with AI</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {visibleHistory.length > 0 && (
          <div ref={chatRef} className="ion-margin-bottom" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {visibleHistory.map((qa, i) => (
              <IonCard key={i} className="ion-margin-bottom">
                <IonCardContent>
                  <p><strong>Q:</strong> {qa.question}</p>
                  {qa.answer && (
                    <p>
                      <strong>A:</strong> {qa.answer}
                      {qa.isStreaming && (
                        <span className={styles.blink} style={{ marginLeft: 6 }}>▋</span>
                      )}
                    </p>
                  )}
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {questionLoading && (
          <div className="ion-text-center ion-margin-top">
            <IonSpinner name="dots" />
            <IonText color="medium">
              <p style={{ fontSize: '0.875rem' }}>AI is thinking...</p>
            </IonText>
          </div>
        )}

        <IonInput
          className="ion-margin-top"
          label="Ask whatever you need to know"
          labelPlacement="floating"
          fill="outline"
          placeholder="Ask AI"
          value={question}
          onIonChange={(e: CustomEvent) => setQuestion(e.detail.value!)}
          disabled={questionLoading}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !questionLoading && question.trim()) {
              e.preventDefault()
              void handleAskQuestion()
            }
          }}
        >
          {questionLoading ? (
            <IonButton
              slot="end"
              fill="clear"
              onClick={handleCancelQuestion}
              color="danger"
            >
              <IonIcon slot="icon-only" icon={closeCircle} />
            </IonButton>
          ) : (
            <IonButton
              slot="end"
              fill="clear"
              onClick={handleAskQuestion}
              disabled={!question.trim()}
            >
              <IonIcon slot="icon-only" icon={send} />
            </IonButton>
          )}
        </IonInput>

        {questionError && (
          <IonText color='danger'>
            <p className='ion-padding'>{questionError}</p>
          </IonText>
        )}
      </IonCardContent>
    </IonCard>
  )
}

// Main Component
const AIFeedbackModal: React.FC<AIFeedbackModalProps> = ({ projectId = 2 }) => {
  const modal = useRef<HTMLIonModalElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ProjectAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cachedResults, setCachedResults] = useState<Record<number, ProjectAnalysisResponse & { timestamp: Date }>>({})

  const [question, setQuestion] = useState<string>('')
  const [questionLoading, setQuestionLoading] = useState(false)
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [qaHistory, setQaHistory] = useState<QAEntry[]>([])

  // wrapper to set history with functional updater
  const updateQaHistory = useCallback((updater: (prev: QAEntry[]) => QAEntry[]) => {
    setQaHistory(prev => updater(prev))
  }, [])

  // Dismiss modal
  const dismiss = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    modal.current?.dismiss()
  }, [])

  // Ensure we abort any open requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [])

  // Handle modal open
  const handleOpen = useCallback(async () => {
    const cachedProjectAnalysis = cachedResults[projectId]
    // Use cache only if it exists and is NOT expired
    if (cachedProjectAnalysis && !isDateExpired(cachedProjectAnalysis.timestamp)) {
      setData(cachedProjectAnalysis)
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const helper = new RequestHelper(
        `${ANALYZE_PROJECT_BY_AI_URL}/${projectId}`,
        METHOD_HTTP.GET,
        RESPONSE_TYPE.JSON
      )
      helper.addHeaders('Content-Type', 'application/json')
      const response = await helper.buildRequest<ProjectAnalysisResponse>()

      // ensure timestamp and proper typing
      const withTs = { ...(response as ProjectAnalysisResponse), timestamp: new Date() }
      setData(withTs as any)
      setCachedResults((prev) => ({ ...prev, [projectId]: withTs }))
    } catch (err: any) {
      console.error('Analysis fetch error', err)
      setError('Failed to get analysis done. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [projectId, cachedResults])

  // Ask question
  const handleAskQuestion = useCallback(async () => {
    if (!question.trim()) return

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    const newEntry: QAEntry = { question, answer: '', isStreaming: true }
    updateQaHistory(prev => [...prev, newEntry])
    setQuestionLoading(true)
    setQuestionError(null)
    setQuestion('')

    try {
      const response = await fetch(`${QUERY_PROJECT_BY_AI_URL}/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: newEntry.question }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let rawText = ''

      while (!done) {
        const { value, done: chunkDone } = await reader.read()
        done = !!chunkDone
        rawText += decoder.decode(value || new Uint8Array(), { stream: !done })

        // update last entry continuously
        updateQaHistory(prev => updateLastQA(prev, (entry) => ({ ...entry, answer: rawText, isStreaming: !done })))
      }

      if (!rawText.trim()) {
        // graceful fallback
        updateQaHistory(prev => updateLastQA(prev, (entry) => ({ ...entry, answer: 'No response received from AI.', isStreaming: false })))
        return
      }

      // mark streaming false (already done inside loop) but ensure final state
      updateQaHistory(prev => updateLastQA(prev, (entry) => ({ ...entry, isStreaming: false })))

    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.log('Request was cancelled')
        updateQaHistory(prev => updateLastQA(prev, (entry) => ({ ...entry, answer: 'Request cancelled', isStreaming: false })))
        return
      }

      console.error('AI Query Error:', err)
      setQuestionError('Failed to get AI response.')
      updateQaHistory(prev => updateLastQA(prev, (entry) => ({ ...entry, answer: `Something happened. Please try again later.`, isStreaming: false })))
    } finally {
      setQuestionLoading(false)
      abortControllerRef.current = null
    }
  }, [projectId, question, updateQaHistory])

  const handleCancelQuestion = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const canDismiss = useCallback(async (data?: any, role?: string) => await Promise.resolve(role !== 'gesture'), [])

  // Memoized cards to avoid re-render on streaming updates
  const cards = useMemo(() => data ? <ProjectCards data={data} /> : null, [data])

  return (
    <>
      <IonButton id='open-ai-modal' fill='clear' size='default'>
        <IonIcon icon={sparklesOutline} slot='icon-only' />
      </IonButton>

      <IonModal
        ref={modal}
        trigger='open-ai-modal'
        canDismiss={canDismiss}
        onWillPresent={handleOpen}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>AI Feedback</IonTitle>
            <IonButtons slot='end'>
              <IonButton onClick={dismiss} disabled={loading || questionLoading}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className='ion-padding'>
          {loading && (
            <div className={`${styles.loadingContainer} ion-text-center ion-padding`}>
              <IonSpinner name='crescent' />
              <IonText>
                <p className={styles.loadingText}>Analyzing project data...</p>
              </IonText>
            </div>
          )}

          {error !== null && (
            <IonCard color='danger'>
              <IonCardContent>
                <IonText color='light'>
                  <p className='ion-text-center'>{error}</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}

          {!loading && !error && (data != null) && (
            <>
              {cards}
            </>
          )}

          {data && (
            <ChatWithAI
              projectId={projectId}
              qaHistory={qaHistory}
              updateQaHistory={updateQaHistory}
              questionLoading={questionLoading}
              questionError={questionError}
              question={question}
              setQuestion={setQuestion}
              handleAskQuestion={handleAskQuestion}
              handleCancelQuestion={handleCancelQuestion}
            />
          )}

        </IonContent>
      </IonModal>
    </>
  )
}

export { AIFeedbackModal }
