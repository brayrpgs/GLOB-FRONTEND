import React, { useRef, useState, useCallback } from 'react'
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
  IonText
} from '@ionic/react'
import { informationCircleOutline, sparklesOutline } from 'ionicons/icons'
import { RequestHelper } from '../../Helpers/RequestHelper'
import { METHOD_HTTP, RESPONSE_TYPE } from '../../Helpers/FetchHelper'
import { ANALYZE_PROJECT_BY_AI_URL } from '../../common/Common'
import styles from '../../styles/ai-feedback/style.module.css'
import type { ProjectAnalysisResponse } from '../../models/ProjectAnalysisResponse'

interface AIFeedbackModalProps {
  projectId: number
}

// AI Feedback Modal Component
const AIFeedbackModal: React.FC<AIFeedbackModalProps> = ({ projectId = 1 /* JUST FOR NOW BECAUSE IT'S NOT INTEGRATED YET */ }) => {
  // Refs
  const modal = useRef<HTMLIonModalElement>(null)

  // State variables
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ProjectAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cachedResults, setCachedResults] = useState<Record<number, ProjectAnalysisResponse>>({})

  // Dismiss modal
  const dismiss = useCallback(() => {
    modal.current?.dismiss()
  }, [])

  // Handle modal open
  const handleOpen = useCallback(async () => {
    // Check cache first
    if (cachedResults[projectId]) {
      setData(cachedResults[projectId])
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

      setData(response)
      setCachedResults((prev) => ({ ...prev, [projectId]: response }))
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analysis.')
    } finally {
      setLoading(false)
    }
  }, [projectId, cachedResults])

  // Prevent gesture dismissal
  const canDismiss = useCallback(async (data?: any, role?: string) => await Promise.resolve(role !== 'gesture'), [])

  // Render component
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
              <IonButton onClick={dismiss}>Close</IonButton>
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

          {error && (
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
              {/* General Information Card */}
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>General</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList lines='none'>
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

              {/* Overview Card */}
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Overview</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList lines='inset'>
                    <IonItem>
                      <IonLabel className='ion-text-wrap'>
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
                        slot='end'
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel className='ion-text-wrap'>
                        <h3>Productivity</h3>
                        <p>
                          {data.analysis.productivity.averageProductivity !== null
                            ? `${data.analysis.productivity.averageProductivity} (${data.analysis.productivity.notes})`
                            : data.analysis.productivity.notes}
                        </p>
                      </IonLabel>
                    </IonItem>

                    <IonItem>
                      <IonLabel className='ion-text-wrap'>
                        <h3>Issues Overview</h3>
                        <p>{data.analysis.issues.overview}</p>
                      </IonLabel>
                    </IonItem>

                    {data.analysis.issues.bottlenecks?.length
                      ? (
                        <IonItem>
                          <IonLabel className='ion-text-wrap'>
                            <h3>Bottlenecks</h3>
                            {data.analysis.issues.bottlenecks.map((b, i) => (
                              <p key={i}>• {b}</p>
                            ))}
                          </IonLabel>
                        </IonItem>
                        )
                      : null}

                    <IonItem>
                      <IonLabel>
                        <h3>Overdue Issues</h3>
                      </IonLabel>
                      <IonBadge color='danger' slot='end'>
                        {data.analysis.issues.overdueCount}
                      </IonBadge>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>

              {/* Risks Card */}
              {data.analysis.risks?.length
                ? (
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>Risks</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList lines='none'>
                        {data.analysis.risks.map((risk, i) => (
                          <IonItem key={i}>
                            <IonLabel className='ion-text-wrap'>
                              <p>• {risk}</p>
                            </IonLabel>
                          </IonItem>
                        ))}
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                  )
                : null}

              {/* Recommendations Card */}
              {data.analysis.recommendations?.length
                ? (
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>Recommendations</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList lines='none'>
                        {data.analysis.recommendations.map((rec, i) => (
                          <IonItem key={i}>
                            <IonLabel className='ion-text-wrap'>
                              <p>• {rec}</p>
                            </IonLabel>
                          </IonItem>
                        ))}
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                  )
                : null}
            </>
          )}
        </IonContent>
      </IonModal>
    </>
  )
}

export { AIFeedbackModal }
