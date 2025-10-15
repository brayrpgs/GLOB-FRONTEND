import React, { useRef, useState, useCallback } from "react";
import { IonInput, IonButton, IonIcon, IonSpinner, IonToast, useIonRouter } from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import styles from "../../styles/register/styles.module.css";
import { PASSWORD_REGEX } from "../../common/Validator";
import { USER_API_SECURITY_URL } from "../../common/Common";

interface ChangePasswordProps {
    recoverId: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ recoverId }) => {
    // Router and input references
    const router = useIonRouter(); // Router for navigation
    const passwordRef = useRef<HTMLIonInputElement>(null); 
    const confirmPasswordRef = useRef<HTMLIonInputElement>(null); 

    // Component state variables
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [toast, setToast] = useState({
        message: "",
        show: false,
        color: "danger" as "danger" | "success",
    }); // Toast notification messages

    // Password validation logic
    const validateData = useCallback(() => {
        const password = (passwordRef.current?.value as string) || "";
        const confirmPassword = (confirmPasswordRef.current?.value as string) || "";

        if (!password.trim() || !confirmPassword.trim()) {
            setToast({ message: "Please fill in both fields", show: true, color: "danger" });
            return false;
        }

        if (password.length < 8 || password.length > 128) {
            setToast({ message: "Password must be between 8-128 characters.", show: true, color: "danger" });
            return false;
        }

        if (!PASSWORD_REGEX.test(password)) {
            setToast({
                message: "Password must contain at least one uppercase letter, one number, and one special character.",
                show: true,
                color: "danger",
            });
            return false;
        }

        if (password !== confirmPassword) {
            setToast({ message: "Passwords do not match", show: true, color: "danger" });
            return false;
        }

        return true; // Validation passed
    }, []);

    // Handle form submission and API calls
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!validateData()) return;
            if (!recoverId) return;

            setLoading(true); // Show loading spinner
            try {
                // Fetch current user data
                const userResponse = await fetch(`${USER_API_SECURITY_URL}?user_id=${recoverId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!userResponse.ok) {
                    setToast({ message: "We encountered an error, please try again later", show: true, color: "danger" });
                    setLoading(false);
                    return;
                }

                const userData = await userResponse.json();
                const password = (passwordRef.current?.value as string) || "";
                const user = userData[0];

                // Prepare data for password update
                const putData = {
                    email: user.EMAIL,
                    username: user.USERNAME,
                    password,
                    avatarUrl: user.AVATAR_URL,
                    status: user.STATUS,
                    paymentInfo: user.PAYMENTINFO || null
                };

                // Update password via PUT request
                const putResponse = await fetch(`${USER_API_SECURITY_URL}/${recoverId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(putData),
                });

                if (putResponse.ok) {
                    // Show success toast and redirect to login
                    setToast({ message: "Password updated successfully! Redirecting to login...", show: true, color: "success" });

                    setTimeout(() => {
                        if (passwordRef.current) passwordRef.current.value = "";
                        if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
                        setShowPassword(false);
                        setShowConfirmPassword(false);
                        router.push("/login", "forward"); // Navigate to login page
                    }, 2000);
                } else {
                    const err = await putResponse.json();
                    setToast({ message: err.error || "Failed to update password", show: true, color: "danger" });
                }

            } catch (error) {
                console.error(error);
                setToast({ message: "Network error, please try again later", show: true, color: "danger" });
            } finally {
                setLoading(false); // Hide loading spinner
            }
        },
        [validateData, recoverId, router]
    );

    // Render form
    return (
        <form onSubmit={handleSubmit} className={styles["password-form"]} autoComplete="off">
            <h1>Change Password</h1>

            <IonToast
                isOpen={toast.show}
                onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
                message={toast.message}
                duration={1850}
                color={toast.color}
                position="bottom"
            />

            <div className={styles["password-wrapper"]}>
                <IonInput
                    ref={passwordRef}
                    fill="outline"
                    label="New Password"
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

            <IonButton expand="block" color="light" className={styles["register-button"]} type="submit" disabled={loading}>
                {loading ? <IonSpinner name="crescent" color="dark" /> : "Confirm"}
            </IonButton>
        </form>
    );
};

export { ChangePassword };
