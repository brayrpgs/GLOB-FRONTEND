import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { IonPage, IonContent, IonButton, IonToast, IonSpinner, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from "@ionic/react";
import styles from "../../styles/reset/styles.module.css";
import { OTP_REGEX } from "../../common/Validator";

const OTP_LENGTH = 6;

const Page: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [toast, setToast] = useState({ message: "", show: false, color: "danger" as "danger" | "success" });
    const inputRefs = useRef<HTMLInputElement[]>([]);

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length !== OTP_LENGTH) {
            setToast({ message: "Please complete the OTP", show: true, color: "danger" });
            return;
        }

        setIsVerifying(true);
        // Api call
        setIsVerifying(false);
    };

    const [autoVerify, setAutoVerify] = useState(false);

    // Extract OTP from URL on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const otpParam = urlParams.get("otp");
        if (otpParam && OTP_REGEX.test(otpParam)) {
            const otpArray = otpParam.split("");
            setOtp(otpArray);
            setAutoVerify(true);
        }
    }, []);

    // Auto-submit when OTP is fully entered
    useEffect(() => {
        if (autoVerify && otp.join("").length === OTP_LENGTH) {
            handleVerify();
            setAutoVerify(false); 
        }
    }, [otp, autoVerify]);;

    // Handle input changes
    const handleChange = (index: number, value: string) => {
        if (value && OTP_REGEX.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace and navigation
    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevIndex = index - 1;
            inputRefs.current[prevIndex]?.focus();
            const newOtp = [...otp];
            newOtp[prevIndex] = "";
            setOtp(newOtp);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").slice(0, OTP_LENGTH);
        if (!OTP_REGEX.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((char, i) => {
            if (i < OTP_LENGTH) newOtp[i] = char;
        });
        setOtp(newOtp);

        const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    // Render component
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/login" text="" />
                    </IonButtons>
                    <IonTitle className={styles["reset-title"]}>Recover Password</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonToast
                    isOpen={toast.show}
                    onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
                    message={toast.message}
                    duration={2000}
                    color={toast.color}
                />

                <div className={styles["otp-wrapper"]}>
                    <div className={styles["otp-card"]}>
                        <div className={styles["otp-icon"]} style={{
                            background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
                            color: '#fff',
                            fontSize: '32px',
                        }}>
                            OTP
                        </div>

                        <h2>One-Time Password</h2>
                        <p>Enter the 6-digit code sent to your email</p>

                        <div className={styles["otp-inputs"]}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { inputRefs.current[i] = el!; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onPaste={handlePaste}
                                    className={styles["otp-box"]}
                                />
                            ))}
                        </div>

                        <IonButton expand="block" className={styles["otp-button"]} onClick={handleVerify} disabled={isVerifying}>
                            {isVerifying ? <IonSpinner name="crescent" /> : "Verify OTP"}
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export { Page };
