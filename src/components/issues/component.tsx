import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/issues/styles.module.css'
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonSearchbar, IonSelect, IonSelectOption, useIonToast } from '@ionic/react'
import { Issue } from '../../models/Issue'
import { URLHelper } from '../../Helpers/URLHelper'
import { IssueUtils } from '../../utils/IssueUtils'
import { GetIssues } from '../../models/GetIssues'
import { IssueStatus } from '../../enums/IssueStatus'
import { addCircle, informationCircle, trash } from 'ionicons/icons'
import { Colors } from '../../enums/Color'
import { IssueTypeStatus } from '../../enums/IssueTypeStatus'
import { IssueTypePriority } from '../../enums/IssueTypePriority'
import { UserProject } from '../../models/UserProject'
import { User } from '../../models/User'
import { UserProjectUtils } from '../../utils/UserProjectUtils'
import { GetUserProject } from '../../models/GetUserProject'
import { UserUtils } from '../../utils/UserUtils'
import { IssueType } from '../../models/IssueType'
import { IssueTypeUtils } from '../../utils/IssueTypeUtils'
import { ValidateProject } from '../../middleware/ValidateProject'
import { GetIssueType } from '../../models/GetIssueType'
import { Sprint } from '../../models/Sprint'
import { SprintUtils } from '../../utils/SprintUtils'
import { GetSprint } from '../../models/GetSprint'
import { TokenPayloadUtils } from '../../utils/TokenPayloadUtils'

export const component: React.FC = () => {
  /** states */
  const [issues, setIssues] = useState<Issue[]>([])
  const [issuesQuery, setIssuesQuery] = useState<Issue[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [myUsers, setMyUsers] = useState<MyUsers[]>([])
  const [issuesCreateAndEdit, setIssuesCreateAndEdit] = useState<Issue>()
  const [issueTypeCreateAndEdit, setIssueTypeCreateAndEdit] = useState<IssueType>()
  const [sprints, setSprints] = useState<Sprint[]>([])
  //* refs for edit issue */
  const summaryRef = useRef<HTMLIonInputElement>(null)
  const descriptionRef = useRef<HTMLIonInputElement>(null)
  const resolveAtRef = useRef<HTMLIonInputElement>(null)
  const dueDateRef = useRef<HTMLIonInputElement>(null)
  const votesRef = useRef<HTMLIonInputElement>(null)
  const originalEstimationRef = useRef<HTMLIonInputElement>(null)
  const customStartDateRef = useRef<HTMLIonInputElement>(null)
  const storyPointEstimateRef = useRef<HTMLIonInputElement>(null)
  const parentSummaryRef = useRef<HTMLIonSelectElement>(null)
  const issueTypeStatusRef = useRef<HTMLIonSelectElement>(null)
  const issueTypePriorityRef = useRef<HTMLIonSelectElement>(null)
  const userAssignedRef = useRef<HTMLIonSelectElement>(null)
  const userCreatorRef = useRef<HTMLIonSelectElement>(null)
  const userInformatorRef = useRef<HTMLIonSelectElement>(null)
  const sprintIdRef = useRef<HTMLIonSelectElement>(null)
  const statusRef = useRef<HTMLIonSelectElement>(null)
  const [presentToast] = useIonToast()
  useEffect(() => {
    void getIssues(setIssues)
    void exec(setMyUsers)
    if (issues.length > 0) {
      void getSprintsFromBackend(setSprints, issues)
    }
  }, [issues.length])
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
          <IonIcon
            icon={addCircle} size='large' className={styles.icon} id='open-modal'
            onClick={(e) => {
              setIssuesCreateAndEdit(undefined)
              setIssueTypeCreateAndEdit(undefined)
            }}
          />
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
                    className={`${styles.fadeInVertical} ${styles.item} ${styles.cursor}`}
                    onClick={(e) => {
                      setIssuesCreateAndEdit(issue)
                      void getIssueTypeFromBackend(setIssueTypeCreateAndEdit, issue.ISSUE_TYPE)
                      setIsModalOpen(true)
                    }}
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
                    <IonIcon
                      id={`issue-${issue.ISSUE_ID}`}
                      icon={trash}
                      slot='end'
                      className={`${styles.subItem} ${styles.cursor}`}
                      color={Colors[Colors.danger]}
                      onClick={(e) => {
                        void deleteIssue(issue.ISSUE_ID)
                        new ValidateProject(`/project/${new URLHelper().getPathId()}`).redirect()
                      }}
                    />
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

            <IonList mode='ios' className={styles.borderRadius}>
              <IonListHeader>{'Create a new Issue'.toUpperCase()}</IonListHeader>

              <IonItem mode='ios'>
                <IonInput
                  type='text'
                  labelPlacement='floating'
                  mode='ios'
                  label={'summary'.toUpperCase()}
                  value={issuesCreateAndEdit?.SUMMARY ?? ''}
                  ref={summaryRef}
                />
              </IonItem>

              <IonItem mode='ios'>
                <IonInput
                  type='text'
                  labelPlacement='floating'
                  mode='ios'
                  label={'description'.toUpperCase()}
                  value={issuesCreateAndEdit?.DESCRIPTION ?? ''}
                  ref={descriptionRef}
                />
              </IonItem>

              <IonItem mode='ios'>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label={'resolve_at'.toUpperCase()}
                  value={issuesCreateAndEdit?.RESOLVE_AT ?? ''}
                  ref={resolveAtRef}
                />
              </IonItem>

              <IonItem mode='ios'>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label={'due_date'.toUpperCase()}
                  value={issuesCreateAndEdit?.DUE_DATE ?? ''}
                  ref={dueDateRef}
                />
              </IonItem>

              <IonItem mode='ios'>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'votes'.toUpperCase()}
                  value={issuesCreateAndEdit?.VOTES ?? ''}
                  ref={votesRef}
                />
              </IonItem>

              <IonItem mode='ios'>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'original_estimation'.toUpperCase()}
                  value={issuesCreateAndEdit?.ORIGINAL_ESTIMATION ?? ''}
                  ref={originalEstimationRef}
                />
              </IonItem>

              <IonItem mode='ios'>
                <IonInput
                  type='date'
                  labelPlacement='floating'
                  mode='ios'
                  label={'custom_start_date'.toUpperCase()}
                  value={issuesCreateAndEdit?.CUSTOM_START_DATE ?? ''}
                  ref={customStartDateRef}
                />
              </IonItem>

              <IonItem mode='ios'>
                <IonInput
                  type='number'
                  labelPlacement='floating'
                  mode='ios'
                  label={'story_point_estimate'.toUpperCase()}
                  value={issuesCreateAndEdit?.STORY_POINT_ESTIMATE ?? ''}
                  ref={storyPointEstimateRef}
                />
              </IonItem>

              <IonItem mode='ios'>
                <IonSelect
                  labelPlacement='floating'
                  mode='ios'
                  label={'parent_summary'.toUpperCase()}
                  value={issuesCreateAndEdit?.PARENT_SUMMARY_FK ?? 0}
                  defaultValue={0}
                  ref={parentSummaryRef}
                >
                  <IonSelectOption key={0} value={0}>{'not parent'.toUpperCase()}</IonSelectOption>
                  {issues.map((data) => (
                    <IonSelectOption key={data.ISSUE_ID} value={data.ISSUE_ID}>
                      {data.SUMMARY.slice(0, 50)}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem mode='ios'>
                <IonSelect
                  labelPlacement='floating'
                  mode='ios'
                  label={'issue_type_status'.toUpperCase()}
                  value={issueTypeCreateAndEdit?.STATUS ?? 0}
                  ref={issueTypeStatusRef}
                >
                  <IonSelectOption key={0} value={0}>No Type</IonSelectOption>
                  {getIssueTypesStatus().map((data) => (
                    <IonSelectOption key={data} value={data}>
                      {IssueTypeStatus[data]}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem mode='ios'>
                <IonSelect
                  labelPlacement='floating'
                  mode='ios'
                  label={'issue_type_priority'.toUpperCase()}
                  value={issueTypeCreateAndEdit?.PRIORITY ?? 0}
                  ref={issueTypePriorityRef}
                >
                  <IonSelectOption key={0} value={0}>No Priority</IonSelectOption>
                  {getIssueTypesPriority().map((data) => (
                    <IonSelectOption key={data} value={data}>
                      {IssueTypePriority[data]}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem mode='ios'>
                <IonSelect
                  labelPlacement='floating'
                  mode='ios'
                  label={'user_assigned'.toUpperCase()}
                  value={issuesCreateAndEdit?.USER_ASSIGNED_FK ?? 0}
                  ref={userAssignedRef}
                >
                  <IonSelectOption key={0} value={0}>No User</IonSelectOption>
                  {myUsers.map((data) => (
                    <IonSelectOption key={data.userProject.USER_PROJECT_ID} value={data.userProject.USER_PROJECT_ID}>
                      {data.user.USERNAME} - {data.user.EMAIL}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem mode='ios'>
                <IonSelect
                  labelPlacement='floating'
                  mode='ios'
                  label={'user_creator'.toUpperCase()}
                  value={issuesCreateAndEdit?.USER_CREATOR_ISSUE_FK ?? 0}
                  ref={userCreatorRef}
                >
                  <IonSelectOption key={0} value={0}>No User</IonSelectOption>
                  {myUsers.map((data) => (
                    <IonSelectOption key={data.userProject.USER_PROJECT_ID} value={data.userProject.USER_PROJECT_ID}>
                      {data.user.USERNAME} - {data.user.EMAIL}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem mode='ios'>
                <IonSelect
                  labelPlacement='floating'
                  mode='ios'
                  label={'user_informator'.toUpperCase()}
                  value={issuesCreateAndEdit?.USER_INFORMATOR_ISSUE_FK ?? 0}
                  ref={userInformatorRef}
                >
                  <IonSelectOption key={0} value={0}>No User</IonSelectOption>
                  {myUsers.map((data) => (
                    <IonSelectOption key={data.userProject.USER_PROJECT_ID} value={data.userProject.USER_PROJECT_ID}>
                      {data.user.USERNAME} - {data.user.EMAIL}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem mode='ios'>
                <IonSelect
                  labelPlacement='floating'
                  mode='ios'
                  label={'sprint_id'.toUpperCase()}
                  value={issuesCreateAndEdit?.SPRINT_ID_FK ?? 0}
                  ref={sprintIdRef}
                >
                  <IonSelectOption key={0} value={0}>No Sprint</IonSelectOption>
                  {sprints.map((sprint) => (
                    <IonSelectOption key={sprint.SPRINT_ID} value={sprint.SPRINT_ID}>
                      {sprint.NAME} - {sprint.DESCRIPTION}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem mode='ios'>
                <IonSelect
                  labelPlacement='floating'
                  mode='ios'
                  label={'status'.toUpperCase()}
                  value={issuesCreateAndEdit?.STATUS_ISSUE ?? 0}
                  ref={statusRef}
                >
                  {getIssueStatus().map((status, index) => (
                    <IonSelectOption key={index} value={status}>
                      {IssueStatus[status]}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>
            <div className={styles.form}>
              <IonButton
                fill='outline'
                mode='ios' type='submit' color='success' className={issuesCreateAndEdit?.ISSUE_ID != null ? styles.hide : ''}
                onClick={() => {
                  const exec = async (): Promise<void> => {
                    try {
                      // chaeck required fields with IonToast
                      if (summaryRef.current?.value === '' || descriptionRef.current?.value === '') {
                        throw new Error('Summary and Description are required fields')
                      }
                      if (resolveAtRef.current?.value === '' || dueDateRef.current?.value === '') {
                        throw new Error('Resolve At and Due Date are required fields')
                      }
                      if (customStartDateRef.current?.value === '') {
                        throw new Error('Custom Start Date is a required field')
                      }
                      if (votesRef.current?.value === null || originalEstimationRef.current?.value === null || storyPointEstimateRef.current?.value === null) {
                        throw new Error('Votes, Original Estimation and Story Point Estimate are required fields')
                      }
                      // create a new issueType
                      const issueType = {
                        status: issueTypeStatusRef.current?.value ?? 0,
                        priority: issueTypePriorityRef.current?.value ?? 0
                      }
                      const newIssueType = await new IssueTypeUtils().post<IssueType[]>(issueType)
                      // create issue with the new issueType id
                      const issue = {
                        summary: summaryRef.current?.value ?? '',
                        description: descriptionRef.current?.value ?? '',
                        resolve_at: resolveAtRef.current?.value ?? new Date().toISOString(),
                        due_date: dueDateRef.current?.value ?? new Date().toISOString(),
                        votes: Number(votesRef.current?.value) ?? 0,
                        original_estimation: Number(originalEstimationRef.current?.value) ?? 0,
                        custom_start_date: customStartDateRef.current?.value ?? new Date().toISOString(),
                        story_point_estimate: Number(storyPointEstimateRef.current?.value) ?? 0,
                        parent_summary: parentSummaryRef.current?.value === 0 ? null : Number(parentSummaryRef.current?.value),
                        issue_type: newIssueType[0].ISSUE_TYPE_ID,
                        project_id: new URLHelper().getPathId(),
                        user_assigned: userAssignedRef.current?.value === 0 ? null : userAssignedRef.current?.value,
                        user_creator: userCreatorRef.current?.value === 0 ? null : userCreatorRef.current?.value,
                        user_informator: userInformatorRef.current?.value === 0 ? null : userInformatorRef.current?.value,
                        sprint_id: sprintIdRef.current?.value === 0 ? null : Number(sprintIdRef.current?.value),
                        status: statusRef.current?.value ?? 0
                      }

                      const newIssue = await new IssueUtils().post<Issue>(issue)
                      if (newIssue != null) {
                        await getIssues(setIssues)
                        setIsModalOpen(false)
                      } else {
                        console.error('Error creating issue')
                        setIsModalOpen(false)
                      }
                    } catch (error) {
                      void presentToast({
                        message: (error as Error).message,
                        duration: 2000,
                        color: Colors[Colors.danger],
                        position: 'top'
                      })
                      console.error('Error creating issue', error)
                    }
                  }
                  void exec()
                }}
              >Create Issue
              </IonButton>
              <IonButton
                fill='outline'
                mode='ios'
                color='warning'
                className={issuesCreateAndEdit !== undefined ? '' : styles.hide}
                onClick={(e) => {
                  const exec = async (): Promise<void> => {
                    try {
                      // chaeck required fields with IonToast
                      if (summaryRef.current?.value === '' || descriptionRef.current?.value === '') {
                        throw new Error('Summary and Description are required fields')
                      }
                      if (resolveAtRef.current?.value === '' || dueDateRef.current?.value === '') {
                        throw new Error('Resolve At and Due Date are required fields')
                      }
                      if (customStartDateRef.current?.value === '') {
                        throw new Error('Custom Start Date is a required field')
                      }
                      if (votesRef.current?.value === null || originalEstimationRef.current?.value === null || storyPointEstimateRef.current?.value === null) {
                        throw new Error('Votes, Original Estimation and Story Point Estimate are required fields')
                      }
                      // update a new issueType
                      const newIssueType = await new IssueTypeUtils().patch<IssueType>(
                        {
                          status: issueTypeStatusRef.current?.value as number,
                          priority: issueTypePriorityRef.current?.value as number
                        },
                        issuesCreateAndEdit?.ISSUE_TYPE as number
                      )
                      // create issue with the new issueType id
                      const issue = {
                        summary: summaryRef.current?.value ?? '',
                        description: descriptionRef.current?.value ?? '',
                        resolve_at: resolveAtRef.current?.value ?? new Date().toISOString(),
                        due_date: dueDateRef.current?.value ?? new Date().toISOString(),
                        votes: Number(votesRef.current?.value) ?? 0,
                        original_estimation: Number(originalEstimationRef.current?.value) ?? 0,
                        custom_start_date: customStartDateRef.current?.value ?? new Date().toISOString(),
                        story_point_estimate: Number(storyPointEstimateRef.current?.value) ?? 0,
                        parent_summary: parentSummaryRef.current?.value === 0 ? -1 : Number(parentSummaryRef.current?.value),
                        issue_type: newIssueType.ISSUE_TYPE_ID,
                        project_id: new URLHelper().getPathId(),
                        user_assigned: userAssignedRef.current?.value === 0 ? -1 : userAssignedRef.current?.value,
                        user_creator: userCreatorRef.current?.value === 0 ? -1 : userCreatorRef.current?.value,
                        user_informator: userInformatorRef.current?.value === 0 ? -1 : userInformatorRef.current?.value,
                        sprint_id: sprintIdRef.current?.value === 0 ? -1 : Number(sprintIdRef.current?.value),
                        status: statusRef.current?.value ?? 0
                      }
                      await new IssueUtils().patch<Issue>(
                        issue,
                        issuesCreateAndEdit?.ISSUE_ID as number
                      )
                      setIsModalOpen(false)
                      new ValidateProject(`/project/${new URLHelper().getPathId()}`).redirect()
                    } catch (error) {
                      void presentToast({
                        message: (error as Error).message,
                        duration: 2000,
                        color: Colors[Colors.danger],
                        position: 'top'
                      })
                      console.error('Error updating issue', error)
                    }
                  }
                  void exec()
                }}
              >Update Issue
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

const getIssueTypesStatus = (): IssueTypeStatus[] => {
  return [IssueTypeStatus.Bug, IssueTypeStatus.Epic, IssueTypeStatus.Other, IssueTypeStatus.Story, IssueTypeStatus.Task]
}
const getIssueTypesPriority = (): IssueTypePriority[] => {
  return [IssueTypePriority.Low, IssueTypePriority.Medium, IssueTypePriority.High]
}

const getIssueStatus = (): IssueStatus[] => {
  return [IssueStatus['Not Selected'], IssueStatus['To Do'], IssueStatus['In Progress'], IssueStatus.Done]
}

const getUsersProject = async (): Promise<UserProject[]> => {
  const idProject = new URLHelper().getPathId()
  const issues = await new IssueUtils().get<GetIssues>(
    {
      project_id_fk: idProject
    }
  )
  // processing data
  const idUsers = new Set<number>()
  // get all id_project
  const usersProject = await new UserProjectUtils().get<GetUserProject>({})
  usersProject.data.forEach((value) => { idUsers.add(value.USER_PROJECT_ID) })
  // get every fk from issues
  issues.Issues.forEach((user) => {
    // validate if fk is null
    if (user.USER_ASSIGNED_FK !== null) idUsers.add(user.USER_ASSIGNED_FK)
    if (user.USER_CREATOR_ISSUE_FK !== null) idUsers.add(user.USER_CREATOR_ISSUE_FK)
    if (user.USER_INFORMATOR_ISSUE_FK !== null) idUsers.add(user.USER_INFORMATOR_ISSUE_FK)
  })
  // get every user
  const userProjectArray: UserProject[] = []
  for (const id of idUsers.values()) {
    const usersProject = await new UserProjectUtils().get<GetUserProject>(
      {
        user_project_id: id
      }
    )
    userProjectArray.push(usersProject.data[0])
  }
  // ready
  return userProjectArray
}
const getMyUsers = async (usersProject: UserProject[]): Promise<MyUsers[]> => {
  const result: MyUsers[] = []
  for (const value of usersProject) {
    const user = await new UserUtils().get<User[]>(
      {
        user_id: value.USER_ID_FK
      }
    )
    result.push({
      user: user[0],
      userProject: value
    })
  }
  return result
}

const exec = async (setMyUsers: React.Dispatch<React.SetStateAction<MyUsers[]>>): Promise<void> => {
  const usersProject = await getUsersProject()
  const myUsers = await getMyUsers(usersProject)
  setMyUsers(myUsers)
}

const deleteIssue = async (issueId: number): Promise<void> => {
  await new IssueUtils().delete(issueId)
}

const getIssueTypeFromBackend = async (setIssueType: React.Dispatch<React.SetStateAction<IssueType | undefined>>, id: number): Promise<void> => {
  const requestResult = await new IssueTypeUtils().get<GetIssueType>(
    {
      issue_type_id: id
    }
  )
  setIssueType(requestResult.Issue_type[0])
}

interface MyUsers {
  user: User
  userProject: UserProject
}

const getSprintsFromBackend = async (
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>, issues: Issue[]
): Promise<void> => {
  const setIssues = issues
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
