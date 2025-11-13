import { IssueUtils } from '../../utils/IssueUtils'
import { GetIssues } from '../../models/GetIssues'
import { URLHelper } from '../../Helpers/URLHelper'
import { Sprint } from '../../models/Sprint'
import { SprintUtils } from '../../utils/SprintUtils'
import { GetSprint } from '../../models/GetSprint'
import { Dispatch, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataset
} from 'chart.js'
import styles from '../../styles/sprintsgraph/styles.module.css'

// register Chart.js components once (mejor mover esto a src/index.tsx si es posible)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const component: React.FC = () => {
  const [data, setData] = useState<Sprint[]>()
  useEffect(() => {
    void exec(setData)
  }, [])
  return (
    <fieldset className={styles.sprintsField}>
      <legend>{'progress of sprints'.toUpperCase()}</legend>
      <Line
        className={styles.graph}
        options={options}
        redraw
        data={{
          labels: getLabels(data ?? []),
          datasets: data?.map((sprint, index) => {
            return {
              fill: false,
              label: sprint.NAME,
              data: [index, index, index, index],
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)'
            }
          }) ?? []
        }}
      />
    </fieldset>
  )
}

export { component }

const getLabels = (sprints: Sprint[]): string[] => {
  const labels: string[] = []
  sprints.forEach(sprint => {
    labels.push(sprint.DATE_INIT)
    labels.push(sprint.DATE_END)
  })
  labels.sort()
  return labels
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'sprints progress'.toUpperCase()
    }
  }
}
const exec = async (setData: Dispatch<React.SetStateAction<Sprint[] | undefined>>): Promise<void> => {
  // get all issues project
  const idProject = new URLHelper().getPathId()
  const issuesProject = await new IssueUtils().get<GetIssues>({
    project_id: idProject
  })
  // set for get id sprints unique
  const idSprints = new Set<number>()
  issuesProject.Issues.forEach(issue => {
    if (issue.SPRINT_ID_FK != null) {
      idSprints.add(issue.SPRINT_ID_FK)
    }
  }
  )
  // get sprints da from sets
  const sprints: Sprint[] = []
  for (const idSprint of idSprints) {
    const sprintData = await new SprintUtils().get<GetSprint>({
      sprint_id: idSprint
    })
    if (sprintData.totalData > 0) {
      sprints.push(sprintData.data[0])
    }
  }
  //
  setData(sprints)
}
