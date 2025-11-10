import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/issues/styles.module.css'
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonSearchbar } from '@ionic/react'
import { Issue } from '../../models/Issue'
import { URLHelper } from '../../Helpers/URLHelper'
import { IssueUtils } from '../../utils/IssueUtils'
import { GetIssues } from '../../models/GetIssues'
import { IssueStatus } from '../../enums/IssueStatus'
import { addCircle, informationCircle } from 'ionicons/icons'
import { Colors } from '../../enums/Color'

export const component: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([])
  const [issuesQuery, setIssuesQuery] = useState<Issue[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  /* list references inputs */
  const summaryRef = useRef<HTMLIonInputElement>(null)
  const descriptionRef = useRef<HTMLIonInputElement>(null)
  const resolveAtRef = useRef<HTMLIonInputElement>(null)
  const dueDateRef = useRef<HTMLIonInputElement>(null)
  const votesRef = useRef<HTMLIonInputElement>(null)
  const originalEstimationRef = useRef<HTMLIonInputElement>(null)
  const customStartDateRef = useRef<HTMLIonInputElement>(null)
  const customEndDateRef = useRef<HTMLIonInputElement>(null)
  const storyPointEstimateRef = useRef<HTMLIonInputElement>(null)
  const parentSummaryRef = useRef<HTMLIonInputElement>(null)
  const issueTypeRef = useRef<HTMLIonInputElement>(null)
  const userAssignedRef = useRef<HTMLIonInputElement>(null)
  const userCreatorRef = useRef<HTMLIonInputElement>(null)
  const userInformatorRef = useRef<HTMLIonInputElement>(null)
  const sprintIdRef = useRef<HTMLIonInputElement>(null)
  const statusRef = useRef<HTMLIonInputElement>(null)
  useEffect(() => {
    void getIssues(setIssues)
  }, [])
  return (
    <fieldset className={styles.issuesField}>
      <legend>{'issues'.toUpperCase()}</legend>
      <IonContent>
        <div className={styles.containerSearch}>
          <IonSearchbar
            mode='ios'
            animated
            placeholder='Search issues...'
            onInput={
              (e) => {
                setIssuesQuery(filterIssues(e.currentTarget.value as string, issues))
                if (e.currentTarget.value === '') {
                  setIssuesQuery([])
                }
              }
            }
            onIonClear={(e) => { setIssuesQuery([]) }}
          />
          <IonIcon icon={addCircle} size='large' className={styles.icon} id='open-modal' />
        </div>
        <div>
          <IonList mode='ios' className={styles.borderRadius}>
            {issuesQuery.length > 0
              ? (
                  issuesQuery.map((issue) => (
                    <IonItem
                      mode='ios'
                      key={issue.ISSUE_ID}
                      className={`${styles.fadeInVertical} ${styles.searchItem}`}
                      color='medium'
                      onClick={
                      (e) => {
                        if (e.currentTarget != null) e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }
                    >{`${issue.SUMMARY} - ${issue.DESCRIPTION} - ${IssueStatus[issue.STATUS_ISSUE]}`}
                    </IonItem>)))
              : ''}
            {
              issues.length === 0
                ? (<IonItem mode='ios'>No issues found</IonItem>)
                : (issues.map((issue) => (
                  <IonItem
                    mode='ios'
                    key={issue.ISSUE_ID}
                    className={`${styles.fadeInVertical} ${styles.item}`}
                  >
                    <IonIcon
                      id={`issue-${issue.ISSUE_ID}`}
                      icon={informationCircle}
                      slot='start'
                      className={styles.subItem}
                      color={
                        issue.STATUS_ISSUE === 0
                          ? Colors[Colors.dark]
                          : issue.STATUS_ISSUE === 1
                            ? Colors[Colors.warning]
                            : issue.STATUS_ISSUE === 2
                              ? Colors[Colors.secondary]
                              : Colors[Colors.success]
                      }
                    />
                    <IonLabel className={styles.subItem}>{issue.SUMMARY.length > 25 ? issue.SUMMARY.slice(0, 25) + '...' : issue.SUMMARY}</IonLabel>
                    <IonLabel className={styles.subItem}>{IssueStatus[issue.STATUS_ISSUE]}</IonLabel>
                    <IonLabel className={styles.subItem}>{issue.SPRINT_ID_FK ?? 'No Sprint Selected'}</IonLabel>
                  </IonItem>
                  ))
                  )
            }
          </IonList>
        </div>
        <IonModal
          mode='ios'
          trigger='open-modal'
          animated
          isOpen={isModalOpen}
          onIonModalDidPresent={() => setIsModalOpen(true)}
          onDidDismiss={() => setIsModalOpen(false)}
        >
          <IonContent
            className='ion-padding'
          >

            <IonList>
              <IonListHeader>{'Create a new Issue'.toUpperCase()}</IonListHeader>

              <IonItem>
                <IonInput
                  type='text'
                  labelPlacement='floating'
                  mode='ios'
                  label={'summary'.toUpperCase()}
                  ref={summaryRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='text'
                  labelPlacement='floating'
                  mode='ios'
                  label={'description'.toUpperCase()}
                  ref={descriptionRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label={'resolve_at'.toUpperCase()}
                  ref={resolveAtRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label={'due_date'.toUpperCase()}
                  ref={dueDateRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'votes'.toUpperCase()}
                  ref={votesRef}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'original_estimation'.toUpperCase()}
                  ref={originalEstimationRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label={'custom_start_date'.toUpperCase()}
                  ref={customStartDateRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label={'custom_end_date'.toUpperCase()}
                  ref={customEndDateRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'story_point_estimate'.toUpperCase()}
                  ref={storyPointEstimateRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'parent_summary'.toUpperCase()}
                  ref={parentSummaryRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'issue_type'.toUpperCase()}
                  ref={issueTypeRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'user_assigned'.toUpperCase()}
                  ref={userAssignedRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'user_creator'.toUpperCase()}
                  ref={userCreatorRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'user_informator'.toUpperCase()}
                  ref={userInformatorRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'sprint_id'.toUpperCase()}
                  ref={sprintIdRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'status'.toUpperCase()}
                  ref={statusRef}
                />
              </IonItem>
            </IonList>
            <div className={styles.form}>
              <IonButton
                fill='outline'
                mode='ios' type='submit' color='success'
                onClick={() => {
                  const exec = async (): Promise<void> => {
                    const issue =
                    {
                      summary: summaryRef.current?.value,
                      description: descriptionRef.current?.value,
                      resolve_at: resolveAtRef.current?.value,
                      due_date: dueDateRef.current?.value,
                      votes: Number(votesRef.current?.value),
                      original_estimation: Number(originalEstimationRef.current?.value),
                      custom_start_date: customStartDateRef.current?.value,
                      custom_end_date: customEndDateRef.current?.value,
                      story_point_estimate: Number(storyPointEstimateRef.current?.value),
                      parent_summary: Number(parentSummaryRef.current?.value) === 0 ? null : Number(parentSummaryRef.current?.value),
                      issue_type: Number(issueTypeRef.current?.value) === 0 ? null : Number(issueTypeRef.current?.value),
                      project_id: new URLHelper().getPathId(),
                      user_assigned: Number(userAssignedRef.current?.value) === 0 ? null : Number(userAssignedRef.current?.value),
                      user_creator: Number(userCreatorRef.current?.value) === 0 ? null : Number(userCreatorRef.current?.value),
                      user_informator: Number(userInformatorRef.current?.value) === 0 ? null : Number(userInformatorRef.current?.value),
                      sprint_id: Number(sprintIdRef.current?.value) === 0 ? null : Number(sprintIdRef.current?.value),
                      status: Number(statusRef.current?.value)
                    }

                    const newIssue = await new IssueUtils().post<Issue>(issue)
                    if (newIssue != null) {
                      await getIssues(setIssues)
                      setIsModalOpen(false)
                    } else {
                      console.error('Error creating issue')
                      setIsModalOpen(false)
                    }
                  }
                  void exec()
                }}
              >Create Issue
              </IonButton>
              <IonButton fill='outline' mode='ios' type='reset' color='danger' onClick={() => { setIsModalOpen(false) }}>Close</IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </fieldset>
  )
}

const getIssues = async (setIssues: React.Dispatch<React.SetStateAction<Issue[]>>): Promise<void> => {
  // get id project
  const idProsject = new URLHelper().getPathId()
  // get issues from api
  const issues = await new IssueUtils().get<GetIssues>(
    {
      project_id_fk: idProsject
    }
  )
  setIssues(issues.Issues)
}

const filterIssues = (query: string, issues: Issue[]): Issue[] =>
  issues.filter((issue) =>
    issue.SUMMARY.includes(query) ||
    issue.DESCRIPTION.includes(query) ||
    IssueStatus[issue.STATUS_ISSUE].includes(query) ||
    issue.DUE_DATE.includes(query)
  )
