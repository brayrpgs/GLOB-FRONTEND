import { useEffect, useState } from 'react'
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
  IonSearchbar,
  IonAlert
} from '@ionic/react'
import { addCircle, informationCircle, trash } from 'ionicons/icons'
import { Colors } from '../../enums/Color'
import { Sprint } from '../../models/Sprint'
import { SprintUtils } from '../../utils/SprintUtils'
import { URLHelper } from '../../Helpers/URLHelper'
import { Issue } from '../../models/Issue'
import { IssueUtils } from '../../utils/IssueUtils'
import { GetIssues } from '../../models/GetIssues'
import { GetSprint } from '../../models/GetSprint'
import { ValidateProject } from '../../middleware/ValidateProject'

export const component: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [issues, setIssuesFromProject] = useState<Issue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sprintsQuery, setSprintsQuery] = useState<Sprint[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [sprintToDelete, setSprintToDelete] = useState<number | null>(null)
  const [nameValue, setNameValue] = useState('')
  const [dateInitValue, setDateInitValue] = useState('')
  const [dateEndValue, setDateEndValue] = useState('')

  useEffect(() => {
    void getSprints(setSprints, setIssuesFromProject)
  }, [])

  useEffect(() => {
    if (editingSprint != null) {
      setNameValue(editingSprint.NAME)
      setDateInitValue(editingSprint.DATE_INIT)
      setDateEndValue(editingSprint.DATE_END)
    } else {
      setNameValue('')
      setDateInitValue('')
      setDateEndValue('')
    }
  }, [editingSprint])

  return (
    <fieldset className={styles.sprintField}>
      <legend>SPRINTS</legend>
      <IonContent>

        <div className={styles.containerSearch}>
          <IonSearchbar
            mode='ios'
            animated
            placeholder='Search sprints...'
            value={searchQuery}
            onInput={(e) => {
              const value = e.currentTarget.value ?? ''
              setSearchQuery(value)
              setSprintsQuery(value !== '' ? filterSprints(value, sprints) : [])
            }}
            onIonClear={() => {
              setSearchQuery('')
              setSprintsQuery([])
            }}
          />
          <IonIcon
            icon={addCircle}
            size='large'
            className={styles.icon}
            id='open-modal-sprint'
            onClick={() => {
              setEditingSprint(null)
              setSelectedIssue(null)
              setIsModalOpen(true)
            }}
          />
        </div>

        {searchQuery !== '' && (
          <IonList mode='ios' className={styles.borderRadius}>
            {sprintsQuery.length > 0
              ? sprintsQuery.map((s) => (
                <IonItem
                  key={`search-${s.SPRINT_ID}`}
                  mode='ios'
                  className={`${styles.fadeInVertical} ${styles.searchItem}`}
                  color='medium'
                  onClick={() => {
                    const target = document.getElementById(`sprint-${s.SPRINT_ID}`)
                    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  {`${s.NAME} - ${s.DESCRIPTION} (${s.DATE_INIT} → ${s.DATE_END})`}
                </IonItem>
              ))
              : <IonItem mode='ios'>No matches</IonItem>}
          </IonList>
        )}

        <IonList mode='ios' className={styles.borderRadius}>
          {sprints.length === 0
            ? <IonItem mode='ios'>No sprints found</IonItem>
            : sprints.map((s) => (
              <IonItem
                id={`sprint-${s.SPRINT_ID}`}
                mode='ios'
                key={s.SPRINT_ID}
                className={`${styles.fadeInVertical} ${styles.item} ${styles.cursor}`}
                onClick={() => {
                  setEditingSprint(s)
                  setIsModalOpen(true)
                }}
              >
                <IonIcon
                  icon={informationCircle}
                  slot='start'
                  className={`${styles.subItem}`}
                  color={Colors[Colors.secondary]}
                />
                <IonLabel className={styles.subItem}>{s.NAME}</IonLabel>
                <IonLabel className={styles.subItem}>{s.DATE_INIT}</IonLabel>
                <IonLabel className={styles.subItem}>{s.DATE_END}</IonLabel>
                <IonIcon
                  icon={trash}
                  slot='end'
                  className={`${styles.subItem} ${styles.cursor}`}
                  color={Colors[Colors.danger]}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSprintToDelete(s.SPRINT_ID)
                    setIsAlertOpen(true)
                  }}
                />
              </IonItem>
            ))}
        </IonList>

        <IonAlert
          isOpen={isAlertOpen}
          header='Confirm Deletion'
          message='Are you sure you want to delete this sprint? This action cannot be undone.'
          buttons={[
            { text: 'Cancel', role: 'cancel', handler: () => setIsAlertOpen(false) },
            {
              text: 'Delete',
              role: 'confirm',
              cssClass: 'danger',
              handler: async () => {
                if (sprintToDelete != null) await deleteSprint(sprintToDelete)
                setIsAlertOpen(false)
              }
            }
          ]}
        />

        <IonModal
          mode='ios'
          animated
          isOpen={isModalOpen}
          onDidDismiss={() => {
            setIsModalOpen(false)
            setEditingSprint(null)
            setSelectedIssue(null)
            setNameValue('')
            setDateInitValue('')
            setDateEndValue('')
          }}
        >
          <IonContent className='ion-padding'>
            <IonList>
              <IonListHeader>
                {editingSprint == null ? 'CREATE NEW SPRINT' : 'EDIT SPRINT'}
              </IonListHeader>

              <IonItem>
                <IonInput
                  type='text'
                  labelPlacement='floating'
                  mode='ios'
                  label='NAME'
                  value={nameValue}
                  onIonChange={(e) => setNameValue(e.detail.value ?? '')}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label='START DATE'
                  value={dateInitValue}
                  onIonChange={(e) => setDateInitValue(e.detail.value ?? '')}
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label='END DATE'
                  value={dateEndValue}
                  onIonChange={(e) => setDateEndValue(e.detail.value ?? '')}
                />
              </IonItem>

              {editingSprint == null && (
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
                      if (foundIssue != null) setSelectedIssue(foundIssue)
                    }}
                  >
                    {issues.map((issue) => (
                      <IonSelectOption key={issue.ISSUE_ID} value={issue.ISSUE_ID}>
                        {issue.SUMMARY} - {issue.DESCRIPTION}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              )}
            </IonList>

            <div className={styles.form}>
              <IonButton
                fill='outline'
                mode='ios'
                color='success'
                style={{ display: editingSprint != null ? 'none' : 'block' }}
                onClick={() => {
                  const exec = async (): Promise<void> => {
                    const sprint = {
                      name: nameValue,
                      description: selectedIssue?.SUMMARY,
                      date_init: dateInitValue,
                      date_end: dateEndValue
                    }
                    const newSprint = await new SprintUtils().post<Sprint[]>(sprint)

                    if (newSprint != null && selectedIssue != null) {
                      await new IssueUtils().patch(
                        { sprint_id: newSprint[0].SPRINT_ID },
                        selectedIssue.ISSUE_ID
                      )
                    }

                    await getSprints(setSprints, setIssuesFromProject)
                    setIsModalOpen(false)
                    new ValidateProject(`/project/${new URLHelper().getPathId()}`).redirect()
                  }
                  void exec()
                }}
              >
                Create Sprint
              </IonButton>

              <IonButton
                fill='outline'
                mode='ios'
                color='warning'
                style={{ display: editingSprint == null ? 'none' : 'block' }}
                onClick={() => {
                  const exec = async (): Promise<void> => {
                    if (editingSprint == null) return
                    const updatedSprint = {
                      name: nameValue,
                      date_init: dateInitValue,
                      date_end: dateEndValue
                    }
                    await new SprintUtils().patch(updatedSprint, editingSprint.SPRINT_ID)
                    await getSprints(setSprints, setIssuesFromProject)
                    setEditingSprint(null)
                    setIsModalOpen(false)
                    new ValidateProject(`/project/${new URLHelper().getPathId()}`).redirect()
                  }
                  void exec()
                }}
              >
                Edit Sprint
              </IonButton>

              <IonButton fill='outline' mode='ios' color='danger' onClick={() => setIsModalOpen(false)}>
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
  const setDescriptions = new Set<string>()

  setIssues.forEach((issue) => {
    if (issue.SPRINT_ID_FK != null) setSprintsId.add(issue.SPRINT_ID_FK)
    setDescriptions.add(issue.SUMMARY)
  })

  const projectSprints: Sprint[] = []
  for (const id of setSprintsId.values()) {
    const sprint = await new SprintUtils().get<GetSprint>({ sprint_id: id })
    if (sprint?.data?.[0] != null) projectSprints.push(sprint.data[0])
  }

  for (const description of setDescriptions.values()) {
    const sprintOrphan = await new SprintUtils().get<GetSprint>({ description })
    if (!projectSprints.some((s) => s.SPRINT_ID === sprintOrphan?.data?.[0]?.SPRINT_ID) && sprintOrphan.totalData > 0) {
      projectSprints.push(sprintOrphan?.data?.[0])
    }
  }

  setSprints(projectSprints)
}

const getIssues = async (
  setIssuesFromProject?: React.Dispatch<React.SetStateAction<Issue[]>>
): Promise<Set<Issue>> => {
  try {
    const idProject = new URLHelper().getPathId()
    const issuesRequested = await new IssueUtils().get<GetIssues>({ project_id_fk: idProject })
    const issuesArray = Array.isArray(issuesRequested?.Issues) ? issuesRequested.Issues : []
    const issuesSet = new Set<Issue>(issuesArray)
    if (setIssuesFromProject != null) setIssuesFromProject(issuesArray)
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

const deleteSprint = async (sprintId: number): Promise<void> => {
  try {
    const idProject = new URLHelper().getPathId()
    const issuesRequested = await new IssueUtils().get<GetIssues>({ project_id_fk: idProject })
    const issuesToUpdate = issuesRequested.Issues.filter((issue) => issue.SPRINT_ID_FK === sprintId)

    for (const issue of issuesToUpdate) {
      await new IssueUtils().patch({ sprint_id: -1 }, issue.ISSUE_ID)
    }

    await new SprintUtils().delete(sprintId)
    new ValidateProject(`/project/${new URLHelper().getPathId()}`).redirect()
  } catch (err) {
    console.error('Error:', err)
  }
}
