"use client";

import { Modal, Text, Button, Box, PinInput, Group } from "@mantine/core";
import Image from "next/image";
import Gulchharre from "@/assets/svgs/gulchharre.svg";
import styles from "./OTPVerification.module.css";
import { useState } from "react";

interface OTPModalProps {
  opened: boolean;
  phoneNumber: string;
  handleCloseModal: () => void;
  verifyOtpCallback: (otp: string) => void;
}

export default function OTPModal({
  opened,
  phoneNumber,
  handleCloseModal,
  verifyOtpCallback,
}: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError(false);
  };

  const handleContinue = () => {
    verifyOtpCallback(otp);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseModal}
      centered
      size="md"
      padding="xl"
      radius="md"
      classNames={{
        body: styles.modalBody,
        header: styles.modalHeader,
      }}
      withCloseButton
    >
      <Box className={styles.container}>
        <Image src={Gulchharre} alt="Gulchharre" className={styles.logoImg} />

        <Text className={styles.heading}>Verify with OTP</Text>

        <Text className={styles.subheading}>
          An OTP will be sent to your
          <br />
          mobile for verification.
        </Text>

        <Group className={styles.phoneContainer}>
          <Text className={styles.phoneNumber}>{phoneNumber}</Text>
          <button className={styles.editButton} onClick={handleCloseModal}>
            edit
          </button>
        </Group>

        <Box className={styles.otpContainer}>
          <PinInput
            length={6}
            size="lg"
            type="number"
            value={otp}
            onChange={handleOtpChange}
            error={error}
            classNames={{
              input: error ? styles.otpInputError : styles.otpInput,
            }}
          />
        </Box>

        {error && (
          <Text className={styles.errorText}>
            There was a problem with your
            <br />
            login OTP. Please refresh the
            <br />
            page and try again.
          </Text>
        )}

        <Button
          fullWidth
          size="lg"
          className={`${styles.continueButton} ${otp.length === 6 ? styles.validButton : ""}`}
          variant="filled"
          disabled={otp.length !== 6}
          onClick={handleContinue}
        >
          CONTINUE
        </Button>

        <button className={styles.goBackButton} onClick={handleCloseModal}>
          {/* <IconArrowLeft size={18} /> */}
          <span>Go back</span>
        </button>
      </Box>
    </Modal>
  );
}
