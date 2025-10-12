import React, { useState } from "react";
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
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import styles from '../../styles/login/styles.module.css';

const Page: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Function to validate form data
  function validateData() {
    let valid = true;

    if (email.trim() === "") {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (password.trim() === "") {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) {
      setToastMessage("Please fill in all required fields");
      setShowToast(true);
    }

    return valid;
  }

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateData()) {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:3000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
          }),
        });

        const data = await response.json();

        if (response.ok) {

          setToastMessage("Login successful!");
          setShowToast(true);

          console.log("User: ", data);

        } else {

          setToastMessage(data.message || "Invalid credentials");
          setShowToast(true);
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        setToastMessage("We encountered an error. Please try again.");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color="danger"
          position="top"
        />
        <div className={styles["login-content"]}>
          <IonGrid fixed>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeMd="6" sizeLg="4" className={styles["login-col"]}>
                <h1 className={styles["login-title"]}>Sign in</h1>

                <form onSubmit={handleSubmit}>
                  <IonInput
                    fill="outline"
                    label="Email"
                    labelPlacement="floating"
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    className={`${styles["login-input"]} ${emailError ? styles["error-input"] : ""}`}
                  />

                  <div className={styles["password-wrapper"]}>
                    <IonInput
                      fill="outline"
                      label="Password"
                      labelPlacement="floating"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onIonChange={(e) => setPassword(e.detail.value!)}
                      className={`${styles["login-input"]} ${passwordError ? styles["error-input"] : ""
                        }`}
                    />
                    <IonIcon
                      icon={showPassword ? eyeOffOutline : eyeOutline}
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles["password-icon"]}
                    />
                  </div>

                  <IonButton
                    expand="block"
                    color="light"
                    className={styles["login-button"]}
                    type="submit"
                  >
                    {loading ? (
                      <IonSpinner name="crescent" color="dark" />
                    ) : (
                      "Sign In"
                    )}
                  </IonButton>
                </form>

                <div className={styles["login-links"]}>
                  <IonText color="medium">
                    <a href="#">Forgot password?</a>
                  </IonText>
                  <IonText color="primary">
                    <a
                      href="#"
                      onClick={() =>
                        console.log("Redirect to Create New User page")
                      }
                    >
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

export { Page }
