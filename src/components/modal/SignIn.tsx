"use client";

import { useState, useEffect } from "react";
import { Modal, TextInput, Button, Text, Box } from "@mantine/core";
import Image from "next/image";
import Peacock from "@/assets/logos/peacock.svg";
import styles from "./SignIn.module.css";

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
        <Image
          src={Peacock}
          alt="Qala Chowk"
          width={48}
          height={48}
          style={{ marginBottom: "0.75rem" }}
        />
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
