import React, { useRef, useState, useCallback } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSpinner,
  IonToast,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  useIonRouter,
} from "@ionic/react";
import { eyeOutline, eyeOffOutline, cloudUploadOutline } from "ionicons/icons";
import styles from "../../styles/register/styles.module.css";
import { USER_API_SECURITY_URL } from "../../common/Common";
import { PASSWORD_REGEX } from "../../common/Validator";

// Register Page Component
const Page: React.FC = () => {
  // Router instance
  const router = useIonRouter();

  // Refs for input fields
  const emailRef = useRef<HTMLIonInputElement>(null);
  const usernameRef = useRef<HTMLIonInputElement>(null);
  const passwordRef = useRef<HTMLIonInputElement>(null);
  const confirmPasswordRef = useRef<HTMLIonInputElement>(null);

  // State variables
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [toast, setToast] = useState({
    message: "",
    show: false,
    color: "danger" as "danger" | "success",
  });

  // Validate input data
  const validateData = useCallback(() => {
    const email = (emailRef.current?.value as string) || "";
    const username = (usernameRef.current?.value as string) || "";
    const password = (passwordRef.current?.value as string) || "";
    const confirmPassword = (confirmPasswordRef.current?.value as string) || "";

    // Basic validation
    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      setToast(prev => ({ ...prev, message: "Please fill in all required fields", show: true }));
      return false;
    }

    // Avatar validation
    if (!avatarUrl) {
      setToast(prev => ({ ...prev, message: "Please upload an avatar", show: true }));
      return false;
    }

    // Password length validation
    if (password.length < 8 || password.length > 128) {
      setToast(prev => ({ ...prev, message: "Password must be between 8-128 characters.", show: true }));
      return false;
    }

    // Password complexity validation
    if (!PASSWORD_REGEX.test(password)) {
      setToast(prev => ({ ...prev, message: "Password must contain at least one uppercase letter, one number, and one special character.", show: true }));
      return false;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setToast(prev => ({ ...prev, message: "Passwords do not match", show: true }));
      return false;
    }

    return true;
  }, [avatarUrl]);

  // Show toast message
  const showToast = useCallback((message: string, color: "danger" | "success" = "danger") => {
    setToast({ message, show: true, color });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateData()) return;

      const email = emailRef.current?.value as string;
      const username = usernameRef.current?.value as string;
      const password = passwordRef.current?.value as string;

      setLoading(true);

      try {
        const response = await fetch(USER_API_SECURITY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            username: username.trim(),
            password: password.trim(),
            avatarUrl: avatarUrl,
          }),
        });

        await response.text(); // Consume response body ONLY

        // Handle response
        if (response.status === 201) {
          // Success
          showToast("User registered successfully! Redirecting to login...", "success");

          // Clear form and redirect after a delay
          setTimeout(() => {
            if (emailRef.current) emailRef.current.value = "";
            if (usernameRef.current) usernameRef.current.value = "";
            if (passwordRef.current) passwordRef.current.value = "";
            if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
            setAvatarUrl("");
            setShowPassword(false);
            setShowConfirmPassword(false);
            router.push("/login", "forward");
          }, 2000);

        } else {
          showToast("Registration failed", "danger");
        }
      } catch (error) {
        showToast("An unexpected error occurred", "danger");
      } finally {
        setLoading(false);
      }
    },
    [validateData, showToast, avatarUrl]
  );

  // Handle avatar upload
  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  // Render component
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" text="" />
          </IonButtons>
          <IonTitle className={styles["register-title"]}>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonToast
          isOpen={toast.show}
          onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
          message={toast.message}
          duration={1850}
          color={toast.color}
          position="bottom"
        />

        <div className={styles["register-content"]}>
          <IonGrid fixed>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeMd="6" sizeLg="4" className={styles["register-col"]}>
                <div
                  className={styles["avatar-circle"]}
                  onClick={() => document.getElementById("avatarInput")?.click()}
                  style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : {}}
                >
                  {!avatarUrl && <IonIcon icon={cloudUploadOutline} className={styles["avatar-icon"]} />}
                </div>

                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: "none" }}
                />

                <form onSubmit={handleSubmit} autoComplete="off">
                  <IonInput
                    ref={emailRef}
                    fill="outline"
                    label="Email"
                    labelPlacement="floating"
                    type="email"
                    className={styles["register-input"]}
                    autocomplete="off"
                  />
                  <IonInput
                    ref={usernameRef}
                    fill="outline"
                    label="Username"
                    labelPlacement="floating"
                    className={styles["register-input"]}
                    autocomplete="off"
                  />

                  <div className={styles["password-wrapper"]}>
                    <IonInput
                      ref={passwordRef}
                      fill="outline"
                      label="Password"
                      labelPlacement="floating"
                      type={showPassword ? "text" : "password"}
                      className={styles["register-input"]}
                      autocomplete="new-password"
                    />
                    <IonIcon
                      icon={showPassword ? eyeOffOutline : eyeOutline}
                      onClick={() => setShowPassword(prev => !prev)}
                      className={styles["password-icon"]}
                    />
                  </div>

                  <div className={styles["password-wrapper"]}>
                    <IonInput
                      ref={confirmPasswordRef}
                      fill="outline"
                      label="Confirm Password"
                      labelPlacement="floating"
                      type={showConfirmPassword ? "text" : "password"}
                      className={styles["register-input"]}
                      autocomplete="new-password"
                    />
                    <IonIcon
                      icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      className={styles["password-icon"]}
                    />
                  </div>

                  <IonButton
                    expand="block"
                    color="light"
                    className={styles["register-button"]}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" color="dark" /> : "Register"}
                  </IonButton>
                </form>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export { Page };
