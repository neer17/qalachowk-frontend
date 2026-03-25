"use client";

import { useState, useEffect } from "react";
import { Modal, TextInput, Button, Text, Divider, Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import Google from "@/app/svgs/google.svg";
import styles from "./SignIn.module.css";
import { useAuth } from "@/context/SupabaseAuthContext";
import { API_ENDPOINTS } from "@/utils/constants";
import type { BackendAuthResponse } from "@/context/SupabaseAuthContext";

interface SignInModalProps {
  sendOTPCallback: (phoneNumber: string) => void;
  inputChangeCallback: (input: string) => void;
  onClose: () => void;
}

export default function SignInModal({
  sendOTPCallback,
  inputChangeCallback,
  onClose,
}: SignInModalProps) {
  const [input, setInput] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Validate input whenever it changes
  useEffect(() => {
    // Check if input is a valid email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

    // Check if input is a valid 10-digit phone number
    const isPhone = /^\d{10}$/.test(input);

    // Set validity based on either condition being true
    setIsValid(isEmail || isPhone);
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    inputChangeCallback(e.target.value);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
      const GOOGLE_AUTH_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.GOOGLE_SIGNIN.URL}`;

      // Use Google Identity Services popup flow
      if (!window.google?.accounts?.id) {
        // Load Google Identity Services script if not loaded
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: async (response: any) => {
          try {
            const res = await fetch(GOOGLE_AUTH_ENDPOINT, {
              method: API_ENDPOINTS.GOOGLE_SIGNIN.METHOD,
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ idToken: response.credential }),
            });

            if (!res.ok) {
              const errBody = await res.json().catch(() => null);
              const errMsg =
                errBody?.message ||
                "Google sign-in failed. Please try again.";
              notifications.show({
                title: "Sign-in failed",
                message: errMsg,
                color: "red",
              });
              console.error("Google sign-in failed:", res.status, errBody);
              return;
            }

            const userData: BackendAuthResponse = await res.json();
            await login(userData, "google");
            onClose();
          } catch (error) {
            console.error("Google sign-in error:", error);
            notifications.show({
              title: "Sign-in failed",
              message: "An unexpected error occurred. Please try again.",
              color: "red",
            });
          } finally {
            setIsLoading(false);
          }
        },
      });

      window.google.accounts.id.prompt();
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      centered
      size="md"
      padding="xl"
      radius={0}
      classNames={{
        body: styles.modalBody,
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
      withCloseButton
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Box className={styles.container}>
        <Text className={styles.logo}>QALA CHOWK</Text>

        <Text className={styles.heading}>Hello there!</Text>

        <Text className={styles.subheading}>Sign in with</Text>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <TextInput
            placeholder="Email ID / Mobile number"
            size="md"
            value={input}
            onChange={handleInputChange}
            radius={0}
            classNames={{
              input: styles.input,
            }}
          />

          <Button
            fullWidth
            size="lg"
            radius={0}
            className={`${styles.continueButton} ${isValid ? styles.validButton : ""}`}
            variant="filled"
            disabled={!isValid}
            onClick={() => sendOTPCallback(input)}
          >
            CONTINUE
          </Button>
        </form>

        <Divider
          label="or"
          labelPosition="center"
          my="xl"
          classNames={{
            label: styles.dividerLabel,
            root: styles.divider,
          }}
        />

        <Button
          fullWidth
          size="lg"
          radius={0}
          variant="outline"
          leftSection={
            <Image src={Google} width={20} height={20} alt="Google logo" />
          }
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          loading={isLoading}
        >
          Continue with Google
        </Button>

        <Text className={styles.terms}>
          By signing in, you accept our{" "}
          <a href="#" className={styles.link}>
            T&Cs
          </a>{" "}
          and{" "}
          <a href="#" className={styles.link}>
            Privacy Policy
          </a>
          .
        </Text>
      </Box>
    </Modal>
  );
}
