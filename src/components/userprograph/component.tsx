import { useEffect, useState } from 'react'
import { IonSelect, IonSelectOption, IonContent, IonItem, IonLabel } from '@ionic/react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { getUserProductivity } from '../../utils/ProductivityUtils'
import { UserProjectUtils } from '../../utils/UserProjectUtils'
import { UserUtils } from '../../utils/UserUtils'
import { URLHelper } from '../../Helpers/URLHelper'
import styles from '../../styles/userprograph/styles.module.css'

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
      const projectId = new URLHelper().getPathId()
      const userProjectUtils = new UserProjectUtils()
      const userUtils = new UserUtils()

      const userProjectsResponse = await userProjectUtils.get<any>({ project_id_fk: projectId })
      const userProjects = userProjectsResponse?.data ?? []
      if (userProjects.length === 0) {
        setUsers([])
        return
      }

      const userIds = [...new Set(userProjects.map((u: any) => u.USER_ID_FK))]

      const usersData: User[] = []
      for (const id of userIds) {
        const res = await userUtils.get<any>({ user_id: id })
        if (Array.isArray(res) && res[0] !== undefined && res[0] !== null) {
          usersData.push(res[0])
        }
      }

      setUsers(usersData)
    } catch (err) {
      console.error('Error: ', err)
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
    labels: ['Done', 'In Progress'],
    datasets: [
      {
        label: 'Productivity',
        data: [completed, pending],
        backgroundColor: ['#28a745', '#007bff'],
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
