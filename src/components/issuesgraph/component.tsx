import { useEffect, useMemo, useState } from 'react'
import { IonSelect, IonSelectOption, IonContent, IonItem, IonLabel } from '@ionic/react'
import { Pie } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'

import { URLHelper } from '../../Helpers/URLHelper'
import { IssueUtils } from '../../utils/IssueUtils'
import { SprintUtils } from '../../utils/SprintUtils'
import { GetIssues } from '../../models/GetIssues'
import { GetSprint } from '../../models/GetSprint'
import { Issue } from '../../models/Issue'
import { Sprint } from '../../models/Sprint'
import { IssueStatus } from '../../enums/IssueStatus'

import styles from '../../styles/issuesgraph/styles.module.css'

const component: React.FC = () => {
  // State variables to store issues, sprints, and selected sprint
  const [issues, setIssues] = useState<Issue[]>([])
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null)

  // Function to load issues and sprints from the API
  const loadIssuesAndSprints = async (): Promise<void> => {
    try {
      const projectId = Number(new URLHelper().getPathId())

      const issueUtils = new IssueUtils()
      const issuesResponse = await issueUtils.get<GetIssues>({ project_id_fk: projectId })
      const allIssues = Array.isArray(issuesResponse?.Issues) ? issuesResponse.Issues : []
      setIssues(allIssues)

      const sprintUtils = new SprintUtils()
      const sprintResponse = await sprintUtils.get<GetSprint>({})
      const sprints = sprintResponse?.data
      setSprints(sprints)
    } catch (err) {
      console.error('Error:', err)
      setIssues([])
      setSprints([])
    }
  }

  // Load data when the component mounts
  useEffect(() => {
    void loadIssuesAndSprints()
  }, [])

  // Filter issues based on the selected sprint
  const filteredIssues = useMemo(() => {
    if (selectedSprint === -1) {
      // Default option: issues without assigned sprint
      return issues.filter(i => i.SPRINT_ID_FK == null)
    }
    if (selectedSprint == null) return []
    return issues.filter(i => i.SPRINT_ID_FK === selectedSprint)
  }, [issues, selectedSprint])

  // Count issues by their status
  const countsByState = useMemo(() => {
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0 }
    for (const issue of filteredIssues) {
      const state = issue.STATUS_ISSUE ?? 0
      counts[state as keyof typeof counts] += 1
    }
    return counts
  }, [filteredIssues])

  // Chart.js data configuration
  const data: ChartData<'pie'> = useMemo(() => ({
    labels: Object.keys(IssueStatus).filter(k => isNaN(Number(k))),
    datasets: [
      {
        label: 'Issues by status',
        data: [
          countsByState[0],
          countsByState[1],
          countsByState[2],
          countsByState[3]
        ],
        backgroundColor: [
          'rgba(64,64,64,0.8)', // Not Selected
          'rgba(234,179,8,0.8)', // To Do
          'rgba(59,130,246,0.8)', // In Progress
          'rgba(34,197,94,0.8)' // Done
        ],
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  }), [countsByState])

  // Chart.js options configuration
  const options: ChartOptions<'pie'> = useMemo(() => ({
    responsive: true,
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
  }), [])

  return (
    <fieldset className={styles.userprographField}>
      <legend>SPRINT ISSUE STATUS</legend>
      <IonContent>
        {/* Dropdown to select a sprint */}
        <IonItem>
          <IonLabel>Select a sprint</IonLabel>
          <IonSelect
            mode='ios'
            placeholder='Sprints in the project'
            onIonChange={(e) => setSelectedSprint(Number(e.detail.value))}
          >
            {/* Default option for issues without sprint */}
            <IonSelectOption value={-1}>
              Unassigned sprint
            </IonSelectOption>

            {sprints.map((s) => (
              <IonSelectOption key={s.SPRINT_ID} value={s.SPRINT_ID}>
                {s.NAME}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {/* Display pie chart or messages depending on selection */}
        <div className={styles.chartContainer}>
          {filteredIssues.length > 0
            ? (
              <Pie key={selectedSprint ?? 'none'} data={data} options={options} />
              )
            : selectedSprint == null
              ? (
                <p className={styles.noData}>
                  Select a sprint to see productivity data.
                </p>
                )
              : (
                <p className={styles.noData}>
                  {selectedSprint === -1
                    ? 'There are no issues with unassigned sprint.'
                    : 'This sprint has no issues assigned.'}
                </p>
                )}
        </div>
      </IonContent>
    </fieldset>
  )
}

export { component }
