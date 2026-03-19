"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./page.module.css";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { DeliveryFormRef } from "@/components/forms/CheckoutForm";
import Rupee from "@/components/symbols/Rupee";
import { useMediaQuery } from "@mantine/hooks";
import { AuthProvider as SupabaseAuthProvider } from "@/context/SupabaseAuthContext";
import {
  Grid,
  Box,
  Stack,
  TextInput,
  Group,
  Text,
  Button,
} from "@mantine/core";
import { useCart } from "@/context/CartContext";
import CartProductCard from "@/components/card/CartProductCard";
import { ACTIVE_COUNTRIES, environments, USER_ROLES } from "@/utils/constants";
import { saveCheckoutState, loadCheckoutState } from "@/utils/idb/checkout.idb";
import { OtpService } from "@/lib/api/otpService";
import { DiscountService, DiscountResult } from "@/lib/api/discountService";
import {
  CreateUserRequest,
  CreateUserResponse,
  UserService,
} from "@/lib/api/userService";
import { OrderService } from "@/lib/api/orderService";
import { DeliveryFormValues } from "@/types/ui/checkoutForm";

export default function Checkout() {
  const { cartData, deleteCartData, getTotalPrice } = useCart();
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string>("");

  const [appliedDiscountResponse, setAppliedDiscountResponse] =
    useState<DiscountResult>();

  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);

  const [isVerificationCodeVerified, setIsVerificationCodeVerified] =
    useState(false);

  const [otpRequestTimeoutError, setOtpRequestTimeoutError] =
    useState<string>();

  // Timer state
  const [otpExpiryTime, setOtpExpiryTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Loading state for IDB operations
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  const isSmallerThan1024 = useMediaQuery("(max-width: 1025px)");

  // Create ref for the CheckoutForm
  const formRef = useRef<DeliveryFormRef>(null);

  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await loadCheckoutState();
        if (savedState) {
          // OTP state is intentionally NOT restored on refresh

          // Set form data in the form ref if available
          if (formRef.current && savedState.formData) {
            formRef.current.setFormData(
              savedState.formData,
              savedState.useDifferentBilling,
            );
          }
        }
      } catch (error) {
        console.error("Failed to load saved checkout state:", error);
      } finally {
        setIsStateLoaded(true);
      }
    };

    loadSavedState();
  }, []);

  // Save state whenever relevant state changes
  useEffect(() => {
    if (!isStateLoaded) return;

    const saveState = async () => {
      if (formRef.current) {
        const formData = formRef.current.getFormData();
        const useDifferentBilling = formRef.current.getUseDifferentBilling();

        await saveCheckoutState(
          { ...formData },
          false,
          false,
          null,
          0,
          useDifferentBilling,
        );
      }
    };

    saveState();
  }, [isStateLoaded]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otpExpiryTime && timeRemaining > 0) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((otpExpiryTime - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setOtpExpiryTime(null);
          setIsVerificationCodeSent(false);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [otpExpiryTime, timeRemaining]);

  // Save form state when tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && formRef.current) {
        const formData = formRef.current.getFormData();
        const useDifferentBilling = formRef.current.getUseDifferentBilling();

        saveCheckoutState(
          { ...formData },
          false,
          false,
          null,
          0,
          useDifferentBilling,
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleDeleteItem = async (id: string) => {
    await deleteCartData(id);
  };

  const handleDiscountCouponInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const discountCode = event.target.value;
    setAppliedDiscountCode(discountCode);
  };

  const handleApplyDiscountCoupon = async () => {
    const cartDataValues = cartData.values();

    const productIds: string[] = [];
    const categoryIds: string[] = [];
    let orderAmount = 0;

    for (const item of cartDataValues) {
      // Both product and category ids should be present
      productIds.push(item.id);
      if (item.category && item.category.id) {
        categoryIds.push(item.category.id);
      }

      // TODO: can be done using decimal.js for accuracy
      orderAmount += item.price * item.quantity;
    }

    if (
      !appliedDiscountCode ||
      productIds.length === 0 ||
      categoryIds.length === 0
    )
      return;

    let discountResponse: DiscountResult = { isValid: false };
    try {
      discountResponse = await applyDiscountCode({
        discountCode: appliedDiscountCode,
        appliedProductIds: productIds,
        appliedCategoryIds: categoryIds,
        orderAmount,
      });
    } catch (error) {
      console.error("Error in applying discount code: ", { error });
    }

    setAppliedDiscountResponse(discountResponse);
  };

  const applyDiscountCode = async ({
    discountCode,
    appliedProductIds,
    appliedCategoryIds,
    orderAmount,
  }: {
    discountCode: string;
    appliedProductIds: string[];
    appliedCategoryIds: string[];
    orderAmount: number;
  }): Promise<DiscountResult> => {
    let response;
    try {
      response = await DiscountService.applyDiscountCode({
        discountCode,
        appliedProductIds,
        appliedCategoryIds,
        orderAmount,
      });
    } catch (error) {
      console.error("Error in applying discount code: ", { error });
      throw error;
    }

    return response;
  };

  const handleSendOtp = async (phoneNumber: string) => {
    // For development purposes
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const skipOtpVerification =
      process.env.NEXT_PUBLIC_SKIP_OTP_VERIFICATION === "true";

    if (
      environment === environments.DEVELOPMENT &&
      skipOtpVerification === true
    ) {
      setIsVerificationCodeSent(true);
      setTimeRemaining(120); // 2 minutes in seconds
      return;
    }

    let response;
    try {
      response = await OtpService.sendOtp({ phone: phoneNumber });
    } catch (error) {
      console.error("Error in sending OTP: ", { error });
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Show error message to wait certain minutes before requesting for OTP again
      if (
        response.status == 400 &&
        String(errorData.error).includes("Please wait")
      ) {
        setOtpRequestTimeoutError(errorData.error);
      }

      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    // Update state on success - start 2 minute timer
    const expiryTime = Date.now() + 2 * 60 * 1000; // 2 minutes from now
    setOtpExpiryTime(expiryTime);
    setTimeRemaining(120); // 2 minutes in seconds
    setIsVerificationCodeSent(true);
  };

  const handleOtpVerification = async (
    phoneNumber: string,
    verificationCode: string,
  ) => {
    // For development purposes
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const skipOtpVerification = Boolean(
      process.env.NEXT_PUBLIC_SKIP_OTP_VERIFICATION,
    );

    if (
      environment === environments.DEVELOPMENT &&
      skipOtpVerification === true
    ) {
      return setIsVerificationCodeVerified(true);
    }

    let response;
    try {
      response = await OtpService.verifyOtp({
        phone: phoneNumber,
        otp: verificationCode,
      });
    } catch (error) {
      console.error("Error in verifying OTP: ", { error });
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    // Update state on success - clear timer
    setIsVerificationCodeVerified(true);
    setOtpExpiryTime(null);
    setTimeRemaining(0);
  };

  const handleOtpExpired = () => {
    setIsVerificationCodeSent(false);
    setOtpExpiryTime(null);
    setTimeRemaining(0);
  };

  const createUser = async (
    userData: CreateUserRequest,
  ): Promise<CreateUserResponse> => {
    let response;
    try {
      response = await UserService.createUser(userData);
    } catch (error) {
      console.error("Error in creating user: ", { error });
      throw error;
    }

    return response;
  };

  const handlePayNow = async (data: DeliveryFormValues) => {
    // TODO: makePayment()

    const {
      shippingFirstName,
      shippingLastName,
      email,
      userId,
      shippingAddress,
      shippingLandmark,
      shippingCity,
      shippingState,
      shippingPhone,
      shippingPinCode,
      billingFirstName,
      billingLastName,
      billingAddress,
      billingLandmark,
      billingCity,
      billingState,
      billingPinCode,
      billingPhone,
      isPhoneVerified,
      useDifferentBilling,
    } = data;
    // TODO: can be user id when user is created
    const supabaseId = userId;

    const addresses = [];
    const shippingAddressObj = {
      firstName: shippingFirstName,
      lastName: shippingLastName,
      address: shippingAddress!,
      city: shippingCity!,
      street: shippingLandmark,
      state: shippingState || "",
      country: ACTIVE_COUNTRIES.INDIA,
      pinCode: shippingPinCode || "",
      phone: shippingPhone,
    };
    addresses.push(shippingAddressObj);

    let billingAddressObj;
    if (useDifferentBilling === true) {
      billingAddressObj = {
        firstName: billingFirstName!,
        lastName: billingLastName!,
        address: billingAddress!,
        city: billingCity!,
        street: billingLandmark || "",
        state: billingState!,
        country: ACTIVE_COUNTRIES.INDIA,
        pinCode: billingPinCode!,
        phone: billingPhone!,
      };
      addresses.push(billingAddressObj);
    }

    let user: CreateUserResponse;

    try {
      user = await createUser({
        ...(supabaseId && { supabaseId: supabaseId }),
        firstName: shippingFirstName,
        lastName: shippingLastName,
        email: email,
        phone: shippingPhone,
        country: "INDIA",
        role: USER_ROLES.CUSTOMER,
        phoneVerified: isPhoneVerified,
        addresses: addresses,
      });
    } catch (error) {
      console.error("Error in user creation: ", { error });
      return;
    }

    const cartValues = cartData.values();

    const items: { productId: string; quantity: number }[] = [];
    cartValues.forEach(({ id, quantity }) => {
      items.push({
        productId: id,
        quantity,
      });
    });

    const orderData = {
      userId: user.userId!,
      items,
      paymentId: "PAYMENT_ID_PLACEHOLDER",
      ...(appliedDiscountResponse?.isValid && {
        discountCode: appliedDiscountCode,
      }),
      paymentMethod: "PREPAID" as const,
      paymentStatus: "PAID" as const,
      shippingAddress: {
        address: shippingAddressObj.address,
        city: shippingAddressObj.city,
        state: shippingAddressObj.state,
        country: shippingAddressObj.country,
        pinCode: shippingAddressObj.pinCode,
      },
      ...(useDifferentBilling === true && {
        billingAddress: {
          address: billingAddressObj!.address,
          city: billingAddressObj!.city,
          state: billingAddressObj!.state,
          country: billingAddressObj!.country,
          pinCode: billingAddressObj!.pinCode,
        },
      }),
    };

    try {
      await OrderService.createOrder(orderData);
    } catch (error) {
      console.error("Error in order creation: ", { error });
      throw error;
    }

    // Clear saved checkout form and cart data on successful order creation
    // await clearCheckoutState();
    // await clearCart();
  };

  // Submit form from parent
  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  // Don't render until state is loaded
  if (!isStateLoaded) {
    return (
      <SupabaseAuthProvider>
        <div className={styles.container}>
          <Box py={50} px={{ base: "md", md: "xl" }}>
            <Text>Loading Checkout...</Text>
          </Box>
        </div>
      </SupabaseAuthProvider>
    );
  }

  return (
    <SupabaseAuthProvider>
      <div className={styles.container}>
        <h1 className={styles.pageHeader}>Qala Chowk</h1>

        <Box className={styles.checkoutWrapper}>
          <Grid gutter={{ base: "xl", lg: 80 }} justify="center">
            {/* Left side: Forms */}
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <CheckoutForm
                ref={formRef}
                isVerificationCodeSent={isVerificationCodeSent}
                isVerificationCodeVerified={isVerificationCodeVerified}
                sendOtpCallback={handleSendOtp}
                verifyOtpCallback={handleOtpVerification}
                onPayNow={handlePayNow}
                otpExpiryTime={otpExpiryTime}
                timeRemaining={timeRemaining}
                onOtpExpired={handleOtpExpired}
                otpRequestTimeoutError={otpRequestTimeoutError}
              />

              {!isSmallerThan1024 && (
                <button
                  type="button"
                  className={styles.payNowButton}
                  onClick={handleFormSubmit}
                  style={{ marginTop: "3rem" }}
                  aria-label="Pay Now Checkout"
                >
                  Pay Now
                </button>
              )}
            </Grid.Col>

            {/* Right side: Order Summary */}
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Box className={styles.summaryWrapper}>
                <h2>Order Summary</h2>

                <Stack gap="lg" mb={32} mt="md">
                  {Array.from(cartData.values()).map((item) => (
                    <CartProductCard
                      key={item.id}
                      {...item}
                      isOrderSummaryCard
                      crossButtonWidth="10px"
                      crossButtonHeight="10px"
                      deleteCartItem={handleDeleteItem}
                    />
                  ))}
                </Stack>

                <div className={styles.mandanaDivider}></div>

                <Group
                  justify="space-between"
                  align="center"
                  mb={24}
                  wrap="nowrap"
                >
                  <TextInput
                    flex={1}
                    placeholder="Discount code (e.g. UTSAV10)"
                    onChange={handleDiscountCouponInputChange}
                    aria-label="Discount Code"
                  />
                  <Button
                    disabled={!appliedDiscountCode}
                    onClick={handleApplyDiscountCoupon}
                  >
                    Apply
                  </Button>
                </Group>

                {appliedDiscountResponse ? (
                  appliedDiscountResponse.isValid ? (
                    <Text c="green" mb="lg">
                      Discount applied successfully
                    </Text>
                  ) : (
                    <Text c="red" mb="lg">
                      Invalid discount coupon
                    </Text>
                  )
                ) : null}

                <Stack gap="md" mt={32}>
                  <Group justify="space-between">
                    <Text className={styles.summaryLabel}>Subtotal</Text>
                    <Text className={styles.summaryValue}>
                      <Rupee />
                      {getTotalPrice() -
                        (appliedDiscountResponse?.discountAmount || 0)}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text className={styles.summaryLabel}>Shipping</Text>
                    <Text
                      className={styles.summaryValue}
                      fs="italic"
                      opacity={0.7}
                    >
                      Complimentary
                    </Text>
                  </Group>

                  <div
                    className={styles.mandanaDivider}
                    style={{ margin: "1.5rem 0" }}
                  ></div>

                  <Group justify="space-between" align="start">
                    <Text className={styles.summaryTotalLabel}>
                      Grand Total
                    </Text>
                    <Stack align="end" gap={0}>
                      <Text className={styles.summaryTotalValue}>
                        <Rupee />
                        {getTotalPrice() -
                          (appliedDiscountResponse?.discountAmount || 0)}
                      </Text>
                      <Text
                        size="xs"
                        opacity={0.6}
                        style={{
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginTop: "4px",
                        }}
                      >
                        Inclusive of all taxes
                      </Text>
                    </Stack>
                  </Group>
                </Stack>

                <Group justify="center" mt={60} opacity={0.4}>
                  <Text
                    size="xs"
                    style={{
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Secure Encrypted Checkout
                  </Text>
                </Group>
              </Box>
            </Grid.Col>
          </Grid>
        </Box>

        {isSmallerThan1024 && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              zIndex: 1000,
            }}
          >
            <button className={styles.payNowButton} onClick={handleFormSubmit}>
              Pay Now
            </button>
          </div>
        )}
      </div>
    </SupabaseAuthProvider>
  );
}
