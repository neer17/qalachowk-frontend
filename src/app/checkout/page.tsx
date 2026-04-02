"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./page.module.css";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { DeliveryFormRef } from "@/components/forms/CheckoutForm";
import Rupee from "@/components/symbols/Rupee";
import { useRouter } from "next/navigation";
import { Text } from "@mantine/core";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/SupabaseAuthContext";
import CartProductCard from "@/components/card/CartProductCard";
import { notifications } from "@mantine/notifications";
import { ACTIVE_COUNTRIES, environments } from "@/utils/constants";
import { saveCheckoutState } from "@/utils/idb/checkout.idb";
import { OtpService } from "@/lib/api/otpService";
import { DiscountService, DiscountResult } from "@/lib/api/discountService";
import {
  CreateUserRequest,
  CreateUserResponse,
  UserService,
} from "@/lib/api/userService";
import { OrderService } from "@/lib/api/orderService";
import { DeliveryFormValues } from "@/types/ui/checkoutForm";
import { sendGAEvent } from "@next/third-parties/google";

export default function Checkout() {
  const { cartData, deleteCartData, getTotalPrice, clearCart } = useCart();
  const { login, user: authUser } = useAuth();
  const router = useRouter();
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string>("");

  const [appliedDiscountResponse, setAppliedDiscountResponse] =
    useState<DiscountResult>();

  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);

  const [isVerificationCodeVerified, setIsVerificationCodeVerified] =
    useState(false);

  const [otpRequestTimeoutError, setOtpRequestTimeoutError] =
    useState<string>();

  const [otpExpiryTime, setOtpExpiryTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const [isStateLoaded] = useState(true);

  const [selectedPayment, setSelectedPayment] = useState<string>("upi");

  const formRef = useRef<DeliveryFormRef>(null);
  const checkoutTracked = useRef(false);

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

  // Fire begin_checkout once after cart/state is loaded
  useEffect(() => {
    if (!isStateLoaded || checkoutTracked.current) return;
    if (process.env.NEXT_PUBLIC_ENVIRONMENT !== environments.PRODUCTION) return;
    checkoutTracked.current = true;

    const total = getTotalPrice();
    const gaItems = Array.from(cartData.values()).map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category?.name,
    }));

    sendGAEvent("event", "begin_checkout", {
      currency: "INR",
      value: total,
      items: gaItems,
    });

    const fbq = (window as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === "function") {
      fbq("track", "InitiateCheckout", {
        value: total,
        currency: "INR",
        num_items: cartData.size,
        content_ids: Array.from(cartData.keys()),
      });
    }
  }, [isStateLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setAppliedDiscountCode(event.target.value);
  };

  const handleApplyDiscountCoupon = async () => {
    const cartDataValues = cartData.values();

    const productIds: string[] = [];
    const categoryIds: string[] = [];
    let orderAmount = 0;

    for (const item of cartDataValues) {
      productIds.push(item.id);
      if (item.category && item.category.id) {
        categoryIds.push(item.category.id);
      }
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
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const skipOtpVerification =
      process.env.NEXT_PUBLIC_SKIP_OTP_VERIFICATION === "true";

    if (
      environment === environments.DEVELOPMENT &&
      skipOtpVerification === true
    ) {
      setIsVerificationCodeSent(true);
      setTimeRemaining(120);
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

    const expiryTime = Date.now() + 2 * 60 * 1000;
    setOtpExpiryTime(expiryTime);
    setTimeRemaining(120);
    setIsVerificationCodeSent(true);
  };

  const handleOtpVerification = async (
    phoneNumber: string,
    verificationCode: string,
  ) => {
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const skipOtpVerification = process.env.NEXT_PUBLIC_SKIP_OTP_VERIFICATION;

    if (
      environment === environments.DEVELOPMENT &&
      skipOtpVerification === "true"
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
    const {
      shippingFirstName,
      shippingLastName,
      email,
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
      useDifferentBilling,
    } = data;

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
    }

    let userIdForOrder: string;

    if (authUser) {
      // User already signed in via navbar — skip createUser, reuse existing session
      userIdForOrder = authUser.id;
    } else {
      // Not signed in — findOrCreate user by phone, then establish session
      let createdUser: CreateUserResponse;
      try {
        createdUser = await createUser({
          firstName: shippingFirstName,
          lastName: shippingLastName,
          phone: shippingPhone,
        });

        // Sign the user into the auth context so they stay logged in
        // after redirect (e.g. to order-confirmed → order-details).
        await login(
          {
            userId: createdUser.userId!,
            firstName: createdUser.firstName || shippingFirstName,
            lastName: createdUser.lastName || shippingLastName,
            phone: shippingPhone,
          },
          "phone",
        );
      } catch (error) {
        console.error("Error in user creation: ", { error });
        notifications.show({
          title: "Error",
          message: "Failed to save your details. Please try again.",
          color: "red",
          position: "top-right",
        });
        return;
      }
      userIdForOrder = createdUser.userId!;
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
      userId: userIdForOrder,
      items,
      paymentId: "PAYMENT_ID_PLACEHOLDER",
      email: email,
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
      const orderDetails = await OrderService.createOrder(orderData);
      const orderId = orderDetails.orderId;

      await clearCart();
      router.push(`/order-confirmed?orderId=${orderId}`);
    } catch (error) {
      console.error("Error in order creation: ", { error });
      notifications.show({
        title: "Error",
        message: "Failed to place your order. Please try again.",
        color: "red",
        position: "top-right",
      });
      return;
    }
  };

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  if (!isStateLoaded) {
    return (
      <>
        <div className={styles.container}>
          <Text py={50} px="xl">
            Loading Checkout...
          </Text>
        </div>
      </>
    );
  }

  const total =
    getTotalPrice() - (appliedDiscountResponse?.discountAmount || 0);
  const itemCount = cartData.size;

  return (
    <>
      <div className={styles.container}>
        {/* ── Progress Steps ── */}
        <div className={styles.checkoutProgress}>
          <div className={`${styles.step} ${styles.stepDone}`}>
            <div className={styles.stepNum}>
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                aria-hidden="true"
              >
                <polyline
                  points="1,4 4,7 9,1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            Bag
          </div>
          <div className={styles.stepSep} />
          <div className={`${styles.step} ${styles.stepActive}`}>
            <div className={styles.stepNum}>2</div>
            Details
          </div>
          <div className={styles.stepSep} />
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            Payment
          </div>
          <div className={styles.stepSep} />
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            Confirm
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className={styles.checkoutLayout}>
          {/* ════ Left: Form Side ════ */}
          <div className={styles.formSide}>
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

            {/* Discount Code Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHead}>
                <div className={styles.formSectionNum}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="var(--t)"
                    strokeWidth="0.85"
                    aria-hidden="true"
                  >
                    <polygon points="6,1 11,3.5 11,8.5 6,11 1,8.5 1,3.5" />
                    <line x1="6" y1="4" x2="6" y2="6" />
                    <circle cx="6" cy="8" r="0.5" fill="var(--t)" />
                  </svg>
                </div>
                <div
                  className={styles.formSectionTitle}
                  style={{ fontSize: "17px" }}
                >
                  Discount Code
                </div>
              </div>
              <div className={styles.couponRow}>
                <input
                  className={styles.couponInput}
                  type="text"
                  placeholder="Enter discount code"
                  onChange={handleDiscountCouponInputChange}
                  aria-label="Discount Code"
                />
                <button
                  className={styles.btnApply}
                  disabled={!appliedDiscountCode}
                  onClick={handleApplyDiscountCoupon}
                >
                  Apply
                </button>
              </div>
              {appliedDiscountResponse ? (
                appliedDiscountResponse.isValid ? (
                  <div
                    className={styles.couponMsg}
                    style={{ color: "#5a7a3a" }}
                  >
                    Discount applied successfully
                  </div>
                ) : (
                  <div
                    className={styles.couponMsg}
                    style={{ color: "var(--s)" }}
                  >
                    Invalid discount coupon
                  </div>
                )
              ) : null}
            </div>

            {/* Payment Method Section */}
            <div className={styles.formSection}>
              <div className={styles.formSectionHead}>
                <div className={styles.formSectionNum}>4</div>
                <div className={styles.formSectionTitle}>Payment Method</div>
                <span className={styles.formSectionSub}>
                  Prepaid orders only
                </span>
              </div>
              <div className={styles.paymentOpts}>
                {[
                  {
                    id: "upi",
                    label: "UPI / GPay / PhonePe",
                    tags: ["GPay", "PhonePe", "Paytm"],
                  },
                  {
                    id: "card",
                    label: "Credit / Debit Card",
                    tags: ["Visa", "MC", "Rupay"],
                  },
                  {
                    id: "netbanking",
                    label: "Net Banking",
                    tags: ["All Banks"],
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    className={`${styles.paymentOpt} ${selectedPayment === opt.id ? styles.paymentOptSelected : ""}`}
                    onClick={() => setSelectedPayment(opt.id)}
                    role="radio"
                    aria-checked={selectedPayment === opt.id}
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSelectedPayment(opt.id)
                    }
                  >
                    <div className={styles.payRadio}>
                      <div className={styles.payRadioDot} />
                    </div>
                    <div className={styles.payLabel}>{opt.label}</div>
                    <div className={styles.payIcons}>
                      {opt.tags.map((tag) => (
                        <span key={tag} className={styles.payIconTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              className={styles.placeOrderBtn}
              onClick={handleFormSubmit}
              aria-label="Place Order"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                aria-hidden="true"
              >
                <path d="M7 1L1 4v6l6 3 6-3V4L7 1z" />
              </svg>
              Place Order · Pay <Rupee />
              {total.toLocaleString("en-IN")}
            </button>
            <div className={styles.secureNote}>
              <svg
                width="11"
                height="12"
                viewBox="0 0 11 12"
                fill="none"
                stroke="var(--br)"
                strokeWidth="0.85"
                aria-hidden="true"
              >
                <path d="M5.5 1L1 3.2v4.3L5.5 11 10 7.5V3.2L5.5 1z" />
              </svg>
              Secure encrypted checkout
            </div>
          </div>

          {/* ════ Right: Order Summary Side ════ */}
          <div className={styles.summarySide}>
            <div className={styles.summaryTitle}>
              Order Summary
              <span className={styles.summaryCount}>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <div className={styles.summaryItems}>
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
            </div>

            {/* Totals */}
            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Subtotal</span>
                <span className={styles.totalVal}>
                  <Rupee />
                  {total.toLocaleString("en-IN")}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Shipping</span>
                <span className={`${styles.totalVal} ${styles.totalValItalic}`}>
                  Complimentary
                </span>
              </div>
              {appliedDiscountResponse?.isValid && (
                <div className={styles.totalRow}>
                  <span
                    className={styles.totalLabel}
                    style={{ color: "#5a7a3a" }}
                  >
                    Discount Applied
                  </span>
                  <span
                    className={styles.totalVal}
                    style={{ color: "#5a7a3a" }}
                  >
                    − <Rupee />
                    {appliedDiscountResponse.discountAmount?.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.totalRowGrand}`}>
                <span
                  className={`${styles.totalLabel} ${styles.totalLabelGrand}`}
                >
                  Grand Total
                </span>
                <div>
                  <span className={styles.totalValGrand}>
                    <Rupee />
                    {total.toLocaleString("en-IN")}
                  </span>
                  <div className={styles.totalNote}>Incl. 3% GST</div>
                </div>
              </div>
            </div>

            {/* Craft Assurance Strip */}
            <div className={styles.assuranceStrip}>
              <div className={styles.assuranceItem}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="var(--t)"
                  strokeWidth="0.85"
                  aria-hidden="true"
                >
                  <path d="M7 1L1 3.5v5L7 13l6-4.5v-5L7 1z" />
                </svg>
                <span>Handcrafted in Jaipur, packed with care</span>
              </div>
              <div className={styles.assuranceItem}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="var(--t)"
                  strokeWidth="0.85"
                  aria-hidden="true"
                >
                  <path d="M1 5h9v7H1z" />
                  <path d="M10 3l3 2v7h-3" />
                  <circle cx="4" cy="12" r="1" />
                  <circle cx="9" cy="12" r="1" />
                </svg>
                <span>Delivered in 3 days across India</span>
              </div>
              <div className={styles.assuranceItem}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="var(--t)"
                  strokeWidth="0.85"
                  aria-hidden="true"
                >
                  <rect x="2" y="5" width="10" height="7" rx="1" />
                  <path d="M5 5V4a2 2 0 0 1 4 0v1" />
                  <circle cx="7" cy="9" r="1" fill="var(--t)" />
                </svg>
                <span>Luxury bamboo gift packaging included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
