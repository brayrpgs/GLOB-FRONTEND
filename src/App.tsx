import { Route } from 'react-router-dom'
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'

/** Import pages */
import { Page as LandingPage } from './pages/landing/page'
import { Page as Error } from './pages/error/page'
import { Page as Login } from './pages/login/page'
import { Page as Register } from './pages/register/page'
import { Page as ResetPassword } from './pages/reset/page'
import { Page as Main } from './pages/main/page'
import { Page as Welcome } from './pages/welcome/page'
import { Page as Contact } from './pages/contact/page'
import { Page as Project } from './pages/project/page'

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet animated>
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/reset' component={ResetPassword} />
        <Route exact path='/home' component={Main} />
        <Route exact path='/welcome' component={Welcome} />
        <Route exact path='/contact' component={Contact} />
        <Route path='/project' component={Project} />
        <Route component={Error} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)

export default App
