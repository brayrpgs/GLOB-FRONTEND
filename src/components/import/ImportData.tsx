import React, { useState, DragEvent, ChangeEvent, useCallback, useRef } from 'react'
import {
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonToast,
  IonSpinner,
  IonIcon
} from '@ionic/react'
import { cloudUploadOutline } from 'ionicons/icons'
import './ImportData.css'
import { CSV_API_IMPORT_EXPORT_URL } from '../../common/Common'

// Import CSV component
const ImportData: React.FC = () => {
  // UI and upload state
  const [showModal, setShowModal] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Toast state
  const [toast, setToast] = useState({
    id: '',
    message: '',
    show: false,
    color: 'danger' as 'danger' | 'success'
  })

  // Unified toast system
  const showToast = useCallback(
    (message: string, color: 'danger' | 'success' = 'danger') => {
      setToast({
        id: crypto.randomUUID(),
        message,
        show: true,
        color
      })
    },
    []
  )

  // Validate and set the selected file
  const processFile = (f: File | undefined) => {
    if (f == null) return
    if (f.name.endsWith('.csv')) {
      setFile(f)
      setFileName(f.name)
      showToast(`File ready: ${f.name}`, 'success')
    } else {
      setFile(null)
      setFileName(null)
      showToast('Invalid file. Only CSV allowed.', 'danger')
    }

    if (fileInputRef.current != null) fileInputRef.current.value = ''
  }

  // Drag & drop behavior
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0])
      event.dataTransfer.clearData()
    }
  }

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    processFile(selectedFile)
  }

  // Upload logic: encode file and send to backend
  const handleUpload = async () => {
    if (file == null) {
      showToast('No file selected for upload', 'danger')
      return
    }

    setLoading(true)

    try {
      // Convert CSV to Base64 (includes full prefix)
      const base64Content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Get JWT token
      const token = localStorage.getItem('authToken')
      if (!token) {
        showToast('Missing authentication token', 'danger')
        setLoading(false)
        return
      }

      // API call
      const response = await fetch(CSV_API_IMPORT_EXPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fileName: file.name,
          base64Content
        })
      })

      // Response handling
      if (response.ok) {
        if (response.status === 201) {
          showToast('File uploaded successfully!', 'success')
        } else {
          showToast('Request succeeded.', 'success')
        }
      } else {
        switch (response.status) {
          case 400:
            showToast('Invalid CSV file. Please upload a Jira export CSV file.', 'danger')
            break
          case 415:
            showToast('Unsupported file type. Please make sure you are uploading a valid Jira CSV file.', 'danger')
            break
          case 422:
            showToast("We couldn't process your data. Please try again later.", 'danger')
            break
          case 500:
            showToast('Server error. Please try again later.', 'danger')
            break
          default:
            showToast('Unexpected error. Please try again.', 'danger')
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      showToast('An error occurred while uploading the file', 'danger')
    } finally {
      setLoading(false)
    }
  }

  // Reset file selection
  const handleClear = () => {
    setFile(null)
    setFileName(null)
    showToast('File cleared', 'success')
    if (fileInputRef.current != null) fileInputRef.current.value = ''
  }

  // Modal control
  const handleOpenModal = () => {
    setToast({ message: '', show: false, color: 'danger', id: '' })
    setFile(null)
    setFileName(null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    handleClear()
    setToast({ message: '', show: false, color: 'danger', id: '' })
    setShowModal(false)
  }

  // UI rendering
  return (
    <>
      <IonToast
        key={toast.id}
        isOpen={toast.show}
        onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
        message={toast.message}
        duration={2500}
        color={toast.color}
        position='bottom'
      />

      <IonButton onClick={handleOpenModal} color='secondary'>
        <IonIcon icon={cloudUploadOutline} />
      </IonButton>

      <IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
        <IonHeader>
          <IonToolbar color='light'>
            <IonTitle>Upload CSV File</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className='ion-padding' style={{ backgroundColor: '#121212' }}>
          <IonText>
            <h2 style={{ textAlign: 'center', color: '#fff' }}>
              Select or drag your CSV file
            </h2>
          </IonText>

          <div
            className='drop-zone'
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            <IonText color='medium'>Tap or drag your CSV file here</IonText>
            <input
              ref={fileInputRef}
              type='file'
              accept='.csv'
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>

          {fileName && (
            <IonText color='primary'>
              <p className='file-name'>{fileName}</p>
            </IonText>
          )}

          <div style={{ height: '20px' }} />

          <IonButton expand='block' color='primary' onClick={handleUpload} disabled={loading}>
            {loading ? <IonSpinner name='crescent' color='light' /> : 'Upload'}
          </IonButton>

          {(file != null) && (
            <IonButton expand='block' color='danger' onClick={handleClear} style={{ marginTop: '10px' }}>
              Clear File
            </IonButton>
          )}

          <IonButton expand='block' color='dark' onClick={handleCloseModal} style={{ marginTop: '10px' }}>
            Close
          </IonButton>
        </IonContent>
      </IonModal>
    </>
  )
}

export { ImportData }
