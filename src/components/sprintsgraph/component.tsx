import { IssueUtils } from '../../utils/IssueUtils'
import { GetIssues } from '../../models/GetIssues'
import { URLHelper } from '../../Helpers/URLHelper'
import { Sprint } from '../../models/Sprint'
import { SprintUtils } from '../../utils/SprintUtils'
import { GetSprint } from '../../models/GetSprint'
import { Dispatch, useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import styles from '../../styles/sprintsgraph/styles.module.css'
import { IonItem, IonLabel, IonProgressBar, IonSelect, IonSelectOption } from '@ionic/react'

// register Chart.js components once (mejor mover esto a src/index.tsx si es posible)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const component: React.FC = () => {
  const [data, setData] = useState<Sprint[]>()
  const [selected, setSelected] = useState<Sprint>()
  useEffect(() => {
    void exec(setData)
  }, [])
  return (
    <fieldset className={styles.sprintsField}>
      <legend>{'progress of sprints'.toUpperCase()}</legend>
      <IonSelect
        labelPlacement='floating'
        label={'select sprint'.toUpperCase()}
        mode='ios'
        onIonChange={(e) => {
          const selected = data?.filter((s) => s.SPRINT_ID === e.target.value)
          if (selected !== undefined) {
            setSelected(selected[0])
          }
        }}
      >
        {
          data?.map((sprint) => (
            <IonSelectOption value={sprint.SPRINT_ID} key={sprint.SPRINT_ID}>
              {sprint.NAME}
            </IonSelectOption>
          ))
        }
      </IonSelect>
      <div>
        <span className={styles.graph}><p>{selected?.DATE_INIT}</p><IonProgressBar value={getValue(selected)} buffer={getValue(selected)} color={getValue(selected) < 0.5 ? 'success' : getValue(selected) < 0.75 ? 'warning' : 'danger'} /><p>{selected?.DATE_END}</p></span>
      </div>

    </fieldset>
  )
}

export { component }

const getValue = (sprint?: Sprint): number => {
  if (sprint !== undefined) {
    const dateInit = new Date(sprint.DATE_INIT).getTime()
    const dateEnd = new Date(sprint.DATE_END).getTime()
    const dateNow = new Date().getTime()
    const dateTotal = dateEnd - dateInit
    const datePass = dateNow - dateInit
    return datePass / dateTotal
  }
  return 0
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
