import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/sprints/styles.module.css'
import {
  IonSelect,
  IonSelectOption,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonSearchbar
} from '@ionic/react'
import { addCircle, informationCircle } from 'ionicons/icons'
import { Colors } from '../../enums/Color'
import { Sprint } from '../../models/Sprint'
import { SprintUtils } from '../../utils/SprintUtils'
import { URLHelper } from '../../Helpers/URLHelper'
import { Issue } from '../../models/Issue'
import { IssueUtils } from '../../utils/IssueUtils'
import { GetIssues } from '../../models/GetIssues'
import { GetSprint } from '../../models/GetSprint'

export const component: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [issues, setIssuesFromProject] = useState<Issue[]>([])
  const [sprintsQuery, setSprintsQuery] = useState<Sprint[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const nameRef = useRef<HTMLIonInputElement>(null)
  const descriptionRef = useRef<HTMLIonInputElement>(null)
  const dateInitRef = useRef<HTMLIonInputElement>(null)
  const dateEndRef = useRef<HTMLIonInputElement>(null)

  useEffect(() => {
    void getSprints(setSprints, setIssuesFromProject)
  }, [])

  return (
    <fieldset className={styles.sprintField}>
      <legend>SPRINTS</legend>
      <IonContent>
        <div className={styles.containerSearch}>
          <IonSearchbar
            mode='ios'
            animated
            placeholder='Search sprints...'
            onInput={(e) => {
              setSprintsQuery(filterSprints(e.currentTarget.value as string, sprints))
              if (e.currentTarget.value === '') setSprintsQuery([])
            }}
            onIonClear={() => {
              setSprintsQuery([])
            }}
          />
          <IonIcon icon={addCircle} size='large' className={styles.icon} id='open-modal-sprint' />
        </div>

        <IonList mode='ios' className={styles.borderRadius}>
          {sprintsQuery.length > 0
            ? (
                sprintsQuery.map((sprint) => (
                  <IonItem
                    key={sprint.SPRINT_ID}
                    mode='ios'
                    className={`${styles.fadeInVertical} ${styles.searchItem}`}
                    onClick={(e) => {
                      e.currentTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    {`${sprint.NAME} - ${sprint.DESCRIPTION} (${sprint.DATE_INIT} → ${sprint.DATE_END})`}
                  </IonItem>
                ))
              )
            : Array.isArray(sprints) && sprints.length === 0
              ? (
                <IonItem mode='ios'>No sprints found</IonItem>
                )
              : (
                  sprints.map((sprint) => (
                    <IonItem
                      key={sprint.SPRINT_ID}
                      mode='ios'
                      className={`${styles.fadeInVertical} ${styles.item}`}
                    >
                      <IonIcon
                        icon={informationCircle}
                        slot='start'
                        className={styles.subItem}
                        color={Colors[Colors.secondary]}
                      />
                      <IonLabel className={styles.subItem}>{sprint.NAME}</IonLabel>
                      <IonLabel className={styles.subItem}>{sprint.DATE_INIT}</IonLabel>
                      <IonLabel className={styles.subItem}>{sprint.DATE_END}</IonLabel>
                    </IonItem>
                  ))
                )}
        </IonList>

        <IonModal
          mode='ios'
          trigger='open-modal-sprint'
          animated
          isOpen={isModalOpen}
          onIonModalDidPresent={() => setIsModalOpen(true)}
          onDidDismiss={() => setIsModalOpen(false)}
        >
          <IonContent className='ion-padding'>
            <IonList>
              <IonListHeader>CREATE NEW SPRINT</IonListHeader>

              <IonItem>
                <IonInput type='text' labelPlacement='floating' mode='ios' label='NAME' ref={nameRef} />
              </IonItem>

              <IonItem>
                <IonInput
                  type='text'
                  labelPlacement='floating'
                  mode='ios'
                  label='DESCRIPTION'
                  ref={descriptionRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label='START DATE'
                  ref={dateInitRef}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label='END DATE'
                  ref={dateEndRef}
                />
              </IonItem>
              <IonItem>
                <IonSelect
                  labelPlacement='fixed'
                  label='Select Issue'
                  mode='ios'
                  placeholder='Select an Issue'
                  className={styles.select}
                  onIonChange={(e) => {
                    const issueId = Number(e.detail.value)
                    const foundIssue = issues.find((i) => i.ISSUE_ID === issueId)
                    if (foundIssue != null) {
                      setSelectedIssue(foundIssue)
                    }
                  }}
                >
                  {
                    issues.map((issue) => (
                      <IonSelectOption key={issue.ISSUE_ID} value={issue.ISSUE_ID}>
                        {issue.SUMMARY} - {issue.DESCRIPTION}
                      </IonSelectOption>
                    ))
                  }
                </IonSelect>
              </IonItem>

            </IonList>

            <div className={styles.form}>
              <IonButton
                fill='outline'
                mode='ios'
                color='success'
                onClick={() => {
                  const exec = async (): Promise<void> => {
                    const sprint = {
                      name: nameRef.current?.value,
                      description: descriptionRef.current?.value,
                      date_init: dateInitRef.current?.value,
                      date_end: dateEndRef.current?.value
                    }
                    const newSprint = await new SprintUtils().post<Sprint[]>(sprint)

                    if (newSprint != null && selectedIssue != null) {
                      await new IssueUtils().patch(
                        { sprint_id: newSprint[0].SPRINT_ID },
                        selectedIssue.ISSUE_ID
                      )
                    }

                    if (newSprint != null) {
                      await getSprints(setSprints, setIssuesFromProject)
                      setIsModalOpen(false)
                    } else {
                      console.error('Error while creating sprint')
                      setIsModalOpen(false)
                    }
                  }
                  void exec()
                }}
              >
                Create Sprint
              </IonButton>

              <IonButton
                fill='outline'
                mode='ios'
                color='danger'
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </fieldset>
  )
}

const getSprints = async (
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>,
  setIssuesFromProject: React.Dispatch<React.SetStateAction<Issue[]>>
): Promise<void> => {
  const setIssues = await getIssues(setIssuesFromProject)
  const setSprintsId = new Set<number>()

  setIssues.forEach((issue) => {
    if (issue.SPRINT_ID_FK != null) setSprintsId.add(issue.SPRINT_ID_FK)
  })

  const projectSprints: Sprint[] = []
  for (const id of setSprintsId.values()) {
    const sprint = await new SprintUtils().get<GetSprint>({ sprint_id: id })
    if (sprint?.data?.[0] != null) projectSprints.push(sprint.data[0])
  }

  setSprints(projectSprints)
}

const getIssues = async (
  setIssuesFromProject?: React.Dispatch<React.SetStateAction<Issue[]>>
): Promise<Set<Issue>> => {
  try {
    const idProject = new URLHelper().getPathId()

    const issuesRequested = await new IssueUtils().get<GetIssues>({
      project_id_fk: idProject
    })

    const issuesArray = Array.isArray(issuesRequested?.Issues)
      ? issuesRequested.Issues
      : []

    const issuesSet = new Set<Issue>(issuesArray)

    if (setIssuesFromProject != null) {
      setIssuesFromProject(issuesArray)
    }

    return issuesSet
  } catch (err) {
    console.error('Error:', err)

    if (setIssuesFromProject != null) setIssuesFromProject([])

    return new Set<Issue>()
  }
}

const filterSprints = (query: string, sprints: Sprint[]): Sprint[] =>
  sprints.filter((s) =>
    s.NAME.toLowerCase().includes(query.toLowerCase()) ||
    s.DESCRIPTION.toLowerCase().includes(query.toLowerCase()) ||
    s.DATE_INIT.includes(query) ||
    s.DATE_END.includes(query)
  )
