import React, { useState } from 'react';
import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonSpinner,
} from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="login-content">
                    <IonGrid fixed>
                        <IonRow className="ion-justify-content-center">
                            <IonCol size="12" sizeMd="6" sizeLg="4" className="login-col">
                                <h1 className="login-title">Sign in</h1>
                                <IonInput
                                    fill="outline"
                                    label="Email"
                                    labelPlacement="floating"
                                    type="email"
                                    value={email}
                                    onIonChange={(e) => setEmail(e.detail.value!)}
                                    className="login-input"
                                />
                                <div className="password-wrapper">
                                    <IonInput
                                        fill="outline"
                                        label="Password"
                                        labelPlacement="floating"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onIonChange={(e) => setPassword(e.detail.value!)}
                                        className="login-input"
                                    />
                                    <IonIcon
                                        icon={showPassword ? eyeOffOutline : eyeOutline}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-icon"
                                    />
                                </div>
                                <IonButton expand="block" color="light" className="login-button">
                                    {loading ? <IonSpinner name="crescent" color="dark" /> : 'Enter'}
                                </IonButton>
                                <IonText color="light" className="forgot-password-text">
                                    <a href="#">Forgot password?</a>
                                </IonText>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
