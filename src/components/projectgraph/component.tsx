import { IonContent, IonItemDivider, IonProgressBar } from '@ionic/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getProgreesProyect } from '../../utils/GraphsUtils'
import { URLHelper } from '../../Helpers/URLHelper'
import styles from '../../styles/projectgraph/style.module.css'

const component: React.FC = () => {
  const [data, setData] = useState<{
    total: number
    done: number
  }>()
  useEffect(() => {
    if (setData !== undefined) {
      void exec(setData)
    }
  }, [])

  return (
    <fieldset className={styles.proyectField}>
      <legend>{'progress project'.toUpperCase()}</legend>
      <IonContent>
        <IonProgressBar
          value={data?.done / data?.total} buffer={data?.done / data?.total}
          color={
            data?.done / data?.total < 0.3
              ? 'danger'
              : data?.done / data?.total < 0.6
                ? 'warning'
                : 'success'
          }
        />
      </IonContent>
    </fieldset>
  )
}

const exec = async (setData: Dispatch<SetStateAction<{
  total: number
  done: number
} | undefined>>): Promise<void> => {
  const result = await getProgreesProyect(new URLHelper().getPathId())
  setData(result)
}
export { component }
