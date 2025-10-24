import { IonButton, IonContent, IonPage, IonToast } from '@ionic/react'
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { RequestHelper } from '../../Helpers/RequestHelper'
import { METHOD_HTTP, RESPONSE_TYPE } from '../../Helpers/FetchHelper'
import { TOKEN_KEY_NAME, USER_API_SECURITY_URL, USER_PROJECT_API_DATA_APLICATION_URL } from '../../common/Common'
import { User } from '../../models/User'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '../../models/TokenPayload'
import styles from '../../styles/welcome/styles.module.css'
import { UserProject } from '../../models/UserProject'

const Page: React.FC = () => {
  const [user, setUser] = useState<User>()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  useEffect(() => {
    void getUserData()
      .then(user => setUser(user[0]))
      .catch(error => console.error(error))
  }, [])
  return (
    <IonPage>
      <Header isLoggedIn />
      <IonContent className={`${styles.animationEnter} ion-padding ${styles.justifyText}`}>
        <h1 className={styles.centerText}>
          Welcome {user?.USERNAME}
        </h1>

        <p className={`${styles.underline} ${styles.centerText}`}> Before of use <strong>Quick Report</strong>, please review the following terms and conditions.</p>

        <h2 className={`${styles.underline} ${styles.centerText}`}><strong>Terms of Use for Quick Report</strong></h2>

        <p className={styles.centerText}><strong>Last Updated: October 10, 2025</strong></p>

        <p>
          Welcome to Quick Report! These Terms of Use (<strong>Terms</strong>) govern your access to and use of the Quick Report application, services, and websites (collectively, the <strong>Service</strong>). Please read these Terms carefully before using the Service.
        </p>

        <p>
          <strong>Disclaimer:</strong>
          This document is a template and not legal advice. It is recommended to consult with a legal professional to ensure your Terms of Use are complete and compliant with all applicable laws.
        </p>

        <p>
          <strong>1. Acceptance of Terms</strong>
          By creating an account, or by accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Service.
        </p>

        <p>
          <strong>2. Description of the Service</strong>
        </p>

        <p>
          Quick Report is a project and task management application designed to be a simpler, more intuitive, and family-friendly alternative to complex issue trackers. The Service allows users to create projects, define tasks, track progress, and collaborate with others in a clear and straightforward manner.
        </p>

        <p>
          Our goal is to provide a tool that is accessible and safe for a wide range of users, including for personal projects, family organization, or small teams.
        </p>

        <p><strong>3. User Accounts and Responsibilities</strong></p>
        <ul>
          <li>
            <p><strong>Account Creation:</strong> You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
          </li>
          <li>
            <p><strong>Eligibility:</strong> You must be at least 13 years old to use the Service, or of the legal age required by your country to consent to use online services.</p>
          </li>
          <li>
            <p><strong>Your Responsibilities:</strong> You are responsible for your conduct and for any data, text, information, and other content ("Content") that you submit, post, and display on the Service.</p>
          </li>
        </ul>

        <p><strong>4. User-Generated Content</strong></p>
        <p>
          You retain ownership of all intellectual property rights in your Content. By posting Content to the Service, you grant Quick Report a non-exclusive, worldwide, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute your Content solely for the purpose of providing and improving the Service.
        </p>

        <p><strong>5. Prohibited Conduct and Content</strong></p>

        <p>Quick Report is a "family-friendly" service. You agree not to post, upload, or distribute any Content or otherwise use the Service to:</p>

        <ul>
          <li><p>Post or transmit content that is unlawful, abusive, harassing, defamatory, pornographic, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable.</p></li>
          <li><p>Harm or exploit minors in any way.</p></li>
          <li><p>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</p></li>
          <li><p>Upload or transmit any material that contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware.</p></li>
          <li><p>Interfere with or disrupt the Service or servers or networks connected to the Service.</p></li>
          <li><p>Violate any applicable local, state, national, or international law.</p></li>
        </ul>

        <p>
          We reserve the right to remove any Content and suspend or terminate accounts that violate these rules, with or without notice.
        </p>

        <p><strong>6. Intellectual Property</strong></p>
        <p>
          All rights, title, and interest in and to the Service (excluding Content provided by users) are and will remain the exclusive property of Quick Report and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
        </p>

        <p><strong>7. Termination</strong></p>
        <p>
          You can stop using our Service at any time. We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. For example, we may suspend or terminate your use if you are not complying with these Terms, or use the Service in any way that would cause us legal liability or disrupt others’ use of the Service.
        </p>

        <p><strong>8. Disclaimers and Limitation of Liability</strong></p>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Your use of the Service is at your sole risk. Quick Report expressly disclaims all warranties of any kind, whether express or implied.
        </p>
        <p>
          In no event shall Quick Report, its directors, employees, or partners be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>

        <p><strong>9. Governing Law</strong></p>
        <p>
          These Terms shall be governed by the laws of the jurisdiction in which Quick Report is headquartered, without regard to its conflict of law provisions.
        </p>

        <p><strong>10. Changes to Terms</strong></p>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>

        <p><strong>11. Contact Us</strong></p>
        <p>
          If you have any questions about these Terms, please contact us at <strong>contact@quickreport.app</strong>.
        </p>
        <IonToast
          message={toastMessage}
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          color='success'
        />
        <IonButton
          color='secondary'
          className={styles.buttonAcept}
          onClick={() => {
            aceptTerms()
              .then((userProject) => {
                const isSave = userProject[0].USER_PROJECT_ID > 0
                if (isSave) {
                  setToastMessage('Terms and Conditions accepted successfully.')
                  setShowToast(true)
                } else {
                  setToastMessage('Error accepting Terms and Conditions.')
                  setShowToast(true)
                }
              })
              .catch(error => console.error(error))
            setTimeout(() => {
              void history.pushState(null, '', '/home')
              history.go(0)
            }, 1000)
          }}
        >
          Accept Terms and Conditions
        </IonButton>
      </IonContent>
      <Footer />
    </IonPage>
  )
}

const getUserData = async (): Promise<User[]> => {
  const jwt = jwtDecode<TokenPayload>(localStorage.getItem(TOKEN_KEY_NAME) as string)
  const userData = new RequestHelper(
    USER_API_SECURITY_URL,
    METHOD_HTTP.GET,
    RESPONSE_TYPE.JSON,
    null,
    { user_id: jwt.id }
  )
  userData.addHeaders('accept', 'application/json')

  // execute request
  return await userData.buildRequest<User[]>()
}

const aceptTerms = async (): Promise<UserProject[]> => {
  const jwt = jwtDecode<TokenPayload>(localStorage.getItem(TOKEN_KEY_NAME) as string)
  const userData = new RequestHelper(
    USER_PROJECT_API_DATA_APLICATION_URL,
    METHOD_HTTP.POST,
    RESPONSE_TYPE.JSON,
    {
      user_id_fk: jwt.id,
      rol_proyect: 1,
      productivity: 0
    }
  )
  userData.addHeaders('accept', 'application/json')
  userData.addHeaders('Authorization', `Bearer ${localStorage.getItem(TOKEN_KEY_NAME) as string}`)
  userData.addHeaders('Content-Type', 'application/json')

  // execute request
  return await userData.buildRequest<UserProject[]>()
}

export { Page }
