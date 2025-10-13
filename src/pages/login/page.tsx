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
  IonRouterLink,
} from "@ionic/react";
import { LOGIN_API_SECURITY_URL } from "../../common/Common";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import styles from "../../styles/login/styles.module.css";

// Login Page Component
const Page: React.FC = () => {

  // Refs for input fields
  const emailRef = useRef<HTMLIonInputElement>(null);
  const passwordRef = useRef<HTMLIonInputElement>(null);

  // State variables
  const [showPassword, setShowPassword] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    show: false,
    color: "danger" as "danger" | "success",
  });

  // Validate input data
  const validateData = useCallback(() => {
    const email = (emailRef.current?.value as string) || "";
    const password = (passwordRef.current?.value as string) || "";

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setToast({
        message: "Please fill in all required fields",
        show: true,
        color: "danger",
      });
      return false;
    }
    return true;
  }, []);

  // Show toast message
  const showToast = useCallback(
    (message: string, color: "danger" | "success" = "danger") => {
      setToast({ message, show: true, color });
    },
    []
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate data before submission
      if (!validateData()) return;

      // Extract values
      const email = emailRef.current?.value as string;
      const password = passwordRef.current?.value as string;

      setLoading(true);

      // Make API call
      try {
        const response = await fetch(LOGIN_API_SECURITY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password: password.trim() }),
        });

        const data = await response.text();

        // Handle response
        if (response.ok) {
          localStorage.setItem("authToken", data);
          showToast("Login successful!", "success");
        } else if (response.status === 400) {
          showToast("Invalid credentials", "danger");
        } else {
          showToast("An unexpected error occurred, please try again.", "danger");
        }
      } catch (error) {
        showToast("An unexpected error occurred, please try again later.", "danger");
      } finally {
        setLoading(false);
      }
    },
    [validateData, showToast]
  );

  // Render component
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonToast
          key={toast.message + Date.now()}
          isOpen={toast.show}
          onDidDismiss={() => setToast((prev) => ({ ...prev, show: false }))}
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
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={styles["password-icon"]}
                    />
                  </div>

                  <IonButton
                    expand="block"
                    color="light"
                    className={styles["login-button"]}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" color="dark" /> : "Sign In"}
                  </IonButton>
                </form>

                <div className={styles["login-links"]}>
                  <IonText color="medium">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Forgot password clicked");
                      }}
                    >
                      Forgot password?
                    </a>
                  </IonText>

                  <IonText color="primary">
                    <IonRouterLink
                      routerLink="/register"
                      className={styles["login-links"]}
                    >
                      Create New User
                    </IonRouterLink>
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
