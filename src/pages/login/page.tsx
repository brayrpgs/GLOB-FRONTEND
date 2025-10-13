import React, { useRef, useState, useCallback } from "react";
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
  IonToast,
} from "@ionic/react";
import { LOGIN_API_SECURITY_URL } from '../../common/Common';
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import styles from '../../styles/login/styles.module.css';

const Page: React.FC = () => {
  const emailRef = useRef<HTMLIonInputElement>(null);
  const passwordRef = useRef<HTMLIonInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", show: false, color: "danger" as "danger" | "success" });

  // Validate input fields
  const validateData = useCallback(() => {
    const email = emailRef.current?.value as string || "";
    const password = passwordRef.current?.value as string || "";

    if (!email.trim() || !password.trim()) {
      setToast({ message: "Please fill in all required fields", show: true, color: "danger" });
      return false;
    }

    return true;
  }, []);

  // Show toast message
  const showToast = useCallback((message: string, color: "danger" | "success" = "danger") => {
    setToast(prev => ({ ...prev, show: false }));

    setTimeout(() => {
      setToast({ message, show: true, color });
    }, 0);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateData()) return;

    const email = emailRef.current?.value as string;
    const password = passwordRef.current?.value as string;

    setLoading(true);

    try {
      const response = await fetch(LOGIN_API_SECURITY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await response.text();

      if (response.ok) {
        localStorage.setItem("authToken", data); // Store token in localStorage
        showToast("Login successful!", "success");

      } else if (response.status === 400) {
        showToast("Invalid credentials", "danger");

      } else {
        showToast("An error occurred. Please try again.", "danger");

      }
    } catch (error) {
      showToast("We encountered an error. Please try again.", "danger");

    } finally {
      setLoading(false);
    }
  }, [validateData]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonToast
          key={toast.message + Date.now()}
          isOpen={toast.show}
          onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
          message={toast.message}
          duration={2500}
          color={toast.color}
          position="bottom"
        />

        <div className={styles["login-content"]}>
          <IonGrid fixed>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeMd="6" sizeLg="4" className={styles["login-col"]}>
                <h1 className={styles["login-title"]}>Sign in</h1>

                <form onSubmit={handleSubmit}>
                  <IonInput
                    ref={emailRef}
                    fill="outline"
                    label="Email"
                    labelPlacement="floating"
                    type="email"
                    className={styles["login-input"]}
                  />

                  <div className={styles["password-wrapper"]}>
                    <IonInput
                      ref={passwordRef}
                      fill="outline"
                      label="Password"
                      labelPlacement="floating"
                      type={showPassword ? "text" : "password"}
                      className={styles["login-input"]}
                    />
                    <IonIcon
                      icon={showPassword ? eyeOffOutline : eyeOutline}
                      onClick={() => setShowPassword(prev => !prev)}
                      className={styles["password-icon"]}
                    />
                  </div>

                  <IonButton expand="block" color="light" className={styles["login-button"]} type="submit">
                    {loading ? <IonSpinner name="crescent" color="dark" /> : "Sign In"}
                  </IonButton>
                </form>

                <div className={styles["login-links"]}>
                  <IonText color="medium"><a href="#">Forgot password?</a></IonText>
                  <IonText color="primary">
                    <a href="#" onClick={() => console.log("Redirect to Create New User page")}>
                      Create New User
                    </a>
                  </IonText>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export { Page };
