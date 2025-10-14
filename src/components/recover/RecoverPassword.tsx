import React, { useRef, useState, useEffect } from "react";
import { IonToast } from "@ionic/react";
import styles from "../../styles/login/styles.module.css";
import { EMAIL_REGEX } from "../../common/Validator";
import { RESET_API_SECURITY_URL } from "../../common/Common";

// Props for RecoverPassword component
interface RecoverPasswordProps {
    isOpen: boolean;
    onClose: () => void;
}

// Modal component for password recovery
const RecoverPassword: React.FC<RecoverPasswordProps> = ({ isOpen, onClose }) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const [toastState, setToastState] = useState<{ show: boolean; message: string; color: "success" | "danger" }>({
        show: false,
        message: "",
        color: "success",
    });

    const [visible, setVisible] = useState(false);
    const [showClass, setShowClass] = useState(false);

    // Store timeout to clean up if needed
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle modal open/close with animation
    useEffect(() => {
        if (isOpen) {
            // Reset toast state when opening
            setToastState({ show: false, message: "", color: "success" });

            setVisible(true);
            setTimeout(() => setShowClass(true), 10);
        } else {
            setShowClass(false);
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
            const timer = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSend = async () => {
        const email = emailRef.current?.value || "";

        if (!email || !EMAIL_REGEX.test(email)) {
            setToastState({ show: true, message: "Please enter a valid email", color: "danger" });
            return;
        }

        try {
            const response = await fetch(RESET_API_SECURITY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.status === 201) {
                setToastState({ show: true, message: "Password reset email sent!", color: "success" });

                // Close modal after toast duration
                if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = setTimeout(() => {
                    if (emailRef.current) emailRef.current.value = "";
                    onClose();
                }, 2000);
            } else if (response.status === 400) {
                setToastState({ show: true, message: "We couldn't find an account with that email", color: "danger" });
            } else if (response.status === 404) {
                setToastState({ show: true, message: "We couldn't find a user with that specification", color: "danger" });
            } else {
                setToastState({ show: true, message: "Unexpected error, try again later", color: "danger" });
            }
        } catch (error) {
            console.error("Error calling recoverPassword API:", error);
            setToastState({ show: true, message: "Network error, please try again later", color: "danger" });
        }
    };

    // Don't render anything if not visible
    if (!visible) return null;

    // Render modal and toast
    return (
        <>
            <div
                className={`${styles['modal-backdrop']} ${showClass ? styles.show : ""}`}
                onClick={onClose}
            >
                <div className={styles['modal-box']} onClick={(e) => e.stopPropagation()}>
                    <h2>Recover Password</h2>
                    <input type="email" placeholder="Email" ref={emailRef} />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>

            <IonToast
                isOpen={toastState.show}
                onDidDismiss={() => setToastState((s) => ({ ...s, show: false }))}
                message={toastState.message}
                color={toastState.color}
                duration={2000}
            />
        </>
    );
};

export { RecoverPassword };
