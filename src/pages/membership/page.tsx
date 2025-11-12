import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonBadge, IonGrid, IonRow, IonCol, useIonToast } from '@ionic/react'
import { checkmarkCircle } from 'ionicons/icons'
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { useState } from 'react'
import { MembershipPlan } from '../../enums/MembershipPlan'
import { TokenPayloadUtils } from '../../utils/TokenPayloadUtils'
import { UserUtils } from '../../utils/UserUtils'
import styles from '../../styles/membership/styles.module.css'
import { Colors } from '../../enums/Color'
import { ValidateHome } from '../../middleware/ValidateHome'

interface Plan {
  name: string
  price: string
  priceSuffix: string
  description: string
  features: string[]
  ctaText: string
  popular: boolean
  icon: string
}

const plans: Plan[] = [
  {
    name: 'BASIC',
    price: '$10',
    priceSuffix: '/month',
    description: 'Perfect for individuals starting to explore.',
    features: [
      'One project administration',
      'Have a dedicated account manager'
    ],
    ctaText: 'Select Plan',
    popular: false,
    icon: '⭐'
  },
  {
    name: 'PLUS',
    price: '$20',
    priceSuffix: '/month',
    description: 'Ideal for professionals who need more power and support.',
    features: [
      'Three projects administration',
      'Have a dedicated account manager',
      'Access to premium templates',
      'Priority support',
      'Monthly performance reports',
      'Access to import Project of Jira'
    ],
    ctaText: 'Get Started Now',
    popular: true,
    icon: '⚡'
  },
  {
    name: 'PRO',
    price: '$45',
    priceSuffix: '/month',
    description: 'The complete solution for teams and companies.',
    features: [
      'Five projects administration',
      'Have a dedicated account manager',
      'Access to premium templates',
      'Priority support',
      'Monthly performance reports',
      'Advanced analytics dashboard',
      'Notifications live',
      'Access to import Project of Jira',
      'Access to use ultimate AI'
    ],
    ctaText: 'Contact Sales',
    popular: false,
    icon: '👑'
  }
]

const Page: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [toast] = useIonToast()
  const handleSelectPlan = async (planName: string): Promise<void> => {
    setSelectedPlan(planName)
    console.log(`Plan selected: ${planName}`)

    try {
      const userId = new TokenPayloadUtils().getTokenPayload().id

      const planId = MembershipPlan[planName as any]

      const exec = async (): Promise<void> => {
        await new UserUtils().patch(
          {
            membership: planId
          }, userId
        )
        void toast({
          message: ('Membership updated successfully'),
          duration: 2000,
          color: Colors[Colors.success],
          position: 'top'
        })
      }

      void exec()
      setTimeout(() => {
        new ValidateHome('/home').redirect()
      }, 2000)
    } catch (error) {
      void toast({
        message: (error as Error).message,
        duration: 2000,
        color: Colors[Colors.danger],
        position: 'top'
      })
      console.error('Error al actualizar el plan de membresía:', error)
    }
  }

  return (
    <IonPage>
      <Header isLoggedIn />
      <IonContent className={`${styles.animationEnter} ion-padding`}>
        {/* Header Section */}
        <IonGrid>
          <IonRow>
            {plans.map((plan) => (
              <IonCol
                key={plan.name}
                size='12'
                sizeMd='6'
                sizeLg='4'
              >
                <IonCard
                  className={`${styles.planCard} ${
                    selectedPlan === plan.name ? styles.selectedCard : ''
                  } ${plan.popular && !selectedPlan ? styles.popularCard : ''}`}
                >
                  {plan.popular && !selectedPlan && (
                    <div className={styles.popularBadge}>
                      <IonBadge color='primary'>
                        ⭐ MOST POPULAR
                      </IonBadge>
                    </div>
                  )}

                  {selectedPlan === plan.name && (
                    <div className={styles.selectedBadge}>
                      <IonBadge color='success'>
                        ✓ SELECTED
                      </IonBadge>
                    </div>
                  )}

                  <IonCardHeader className={styles.cardHeader}>
                    <div className={styles.planIcon}>{plan.icon}</div>
                    <IonCardTitle className={styles.planName}>
                      {plan.name}
                    </IonCardTitle>
                    <IonCardSubtitle className={styles.planDescription}>
                      {plan.description}
                    </IonCardSubtitle>
                    <div className={styles.priceContainer}>
                      <span className={styles.price}>{plan.price}</span>
                      <span className={styles.priceSuffix}>{plan.priceSuffix}</span>
                    </div>
                  </IonCardHeader>

                  <IonCardContent>
                    <IonList lines='none'>
                      {plan.features.map((feature, index) => (
                        <IonItem key={index} className={styles.featureItem}>
                          <IonIcon
                            icon={checkmarkCircle}
                            slot='start'
                            color='success'
                            className={styles.checkIcon}
                          />
                          <IonLabel className='ion-text-wrap'>
                            {feature}
                          </IonLabel>
                        </IonItem>
                      ))}
                    </IonList>

                    <div className={`${styles.planImageContainer} ion-text-center`}>
                      <img
                        src='/Grupo de personas.png'
                        alt='Plan illustration'
                      />
                    </div>
                    <IonButton
                      expand='block'
                      color={selectedPlan === plan.name ? 'success' : plan.popular && !selectedPlan ? 'primary' : 'dark'}
                      className={styles.ctaButton}
                      onClick={async () => await handleSelectPlan(plan.name)}
                    >
                      {selectedPlan === plan.name ? '✓ Selected' : plan.ctaText}
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Trust Section */}
        <div className={styles.trustSection}>
          <p className={styles.trustText}>
            Trusted by over 10,000 customers worldwide
          </p>
        </div>

      </IonContent>
      <Footer />
    </IonPage>
  )
}

export { Page }
