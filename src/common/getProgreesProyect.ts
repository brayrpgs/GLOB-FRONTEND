import { PROJECT_API_DATA_APLICATION_URL, TOKEN_KEY_NAME } from './Common'

const getProgreesProyect = async (projectId: string): Promise<number> => {
  const token = localStorage.getItem(TOKEN_KEY_NAME)
  if (token === null || token.trim() === '') {
    console.error('Dont found the proyect')
    return 0
  }

  try {
    const response = await fetch(`${PROJECT_API_DATA_APLICATION_URL}${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error got the proyect: ${response.statusText}`)
    }

    const project = await response.json()
    const progress = project?.progress?.[0] ?? 0
    return Math.round(progress)
  } catch (error) {
    console.error('Error got the proyect:', error)
    return 0
  }
}

export default getProgreesProyect
