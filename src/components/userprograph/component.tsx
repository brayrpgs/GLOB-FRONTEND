import { useEffect, useState } from 'react'
import { IonSelect, IonSelectOption, IonContent, IonItem, IonLabel } from '@ionic/react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { getUserProductivity } from '../../utils/GraphsUtils'
import { UserProjectUtils } from '../../utils/UserProjectUtils'
import { UserUtils } from '../../utils/UserUtils'
import { URLHelper } from '../../Helpers/URLHelper'
import styles from '../../styles/userprograph/styles.module.css'
import { IssueUtils } from '../../utils/IssueUtils'
import { GetIssues } from '../../models/GetIssues'
import { Issue } from '../../models/Issue'

ChartJS.register(ArcElement, Tooltip, Legend)

interface User {
  USER_ID: number
  USERNAME: string
  EMAIL: string
  AVATAR_URL: string
}

const component: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [dataChart, setDataChart] = useState<{ total: number, done: number }>({ total: 0, done: 0 })

  useEffect(() => {
    void getUsersFromProject()
  }, [])

  const getUsersFromProject = async (): Promise<void> => {
    try {
      const projectId = Number(new URLHelper().getPathId())

      const { ids } = await getUserProjectIdsFromProject(projectId)

      const userProjectUtils = new UserProjectUtils()
      const userUtils = new UserUtils()
      const usersData: User[] = []

      for (const upId of ids) {
        const userProjectResponse = await userProjectUtils.get<any>({ user_project_id: upId })
        const userProject = userProjectResponse?.data?.[0]

        if (userProject?.USER_ID_FK != null) {
          const userResponse = await userUtils.get<User[]>({ user_id: userProject.USER_ID_FK })
          if (Array.isArray(userResponse) && userResponse.length > 0) {
            usersData.push(userResponse[0])
          }
        }
      }

      setUsers(usersData)
    } catch (err) {
      console.error('Error:', err)
      setUsers([])
    }
  }

  useEffect(() => {
    if (selectedUser != null) {
      void loadProductivity(selectedUser)
    }
  }, [selectedUser])

  const loadProductivity = async (userId: number): Promise<void> => {
    const result = await getUserProductivity(userId)
    setDataChart(result)
  }

  const completed = dataChart.done
  const pending = Math.max(dataChart.total - dataChart.done, 0)

  const chartData = {
    labels: ['Done', 'Incomplete'],
    datasets: [
      {
        label: 'Productivity',
        data: [completed, pending],
        backgroundColor: ['#2dd55b', '#c5000f'],
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      tooltip: {
        callbacks: {
          label: (context: { label?: string, formattedValue: string | number }) => {
            const label = context.label ?? ''
            const value = String(context.formattedValue)
            return `${label}: ${value}`
          }
        }
      }
    }
  }

  return (
    <fieldset className={styles.userprographField}>
      <legend>USER PRODUCTIVITY</legend>
      <IonContent>
        <IonItem>
          <IonLabel>Select a user</IonLabel>
          <IonSelect
            mode='ios'
            placeholder='Users in the project'
            onIonChange={(e) => setSelectedUser(Number(e.detail.value))}
          >
            {users.map((u) => (
              <IonSelectOption key={u.USER_ID} value={u.USER_ID}>
                {u.USERNAME ?? `User ${String(u.USER_ID)}`}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <div className={styles.chartContainer}>
          {dataChart.total > 0
            ? (
              <>
                <Doughnut data={chartData} options={chartOptions} />
                <div className={styles.chartCenterText}>
                  {Math.round((completed / dataChart.total) * 100)}%
                </div>
              </>
              )
            : selectedUser == null
              ? (
                <p className={styles.noData}>
                  Select a user to see productivity data.
                </p>
                )
              : (
                <p className={styles.noData}>
                  This user has no assigned issues in this project.
                </p>
                )}
        </div>
      </IonContent>
    </fieldset>
  )
}

export { component }

export const getUserProjectIdsFromProject = async (projectId: number): Promise<{
  ids: number[]
  count: number
}> => {
  const issueUtils = new IssueUtils()

  const resp = await issueUtils.get<GetIssues>({ project_id_fk: projectId })
  const issues: Issue[] = Array.isArray(resp?.Issues) ? resp.Issues : []

  const set = new Set<number>()
  for (const it of issues) {
    if (typeof it.USER_ASSIGNED_FK === 'number') set.add(it.USER_ASSIGNED_FK)
    if (typeof it.USER_CREATOR_ISSUE_FK === 'number') set.add(it.USER_CREATOR_ISSUE_FK)
    if (typeof it.USER_INFORMATOR_ISSUE_FK === 'number') set.add(it.USER_INFORMATOR_ISSUE_FK)
  }

  const ids = [...set]
  return { ids, count: ids.length }
}
