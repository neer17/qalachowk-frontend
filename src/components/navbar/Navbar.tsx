"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import SlidePopup from "@/components/slide_popup/SlidePopup";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/SupabaseAuthContext";
import SignInModal from "@/components/modal/SignIn";
import OTPModal from "@/components/modal/OTPVerification";
import { OtpService } from "@/lib/api/otpService";
import { notifications } from "@mantine/notifications";
import PeacockBrown from "@/assets/peacock.svg";
import Image from "next/image";
import { FocusTrap } from "@mantine/core";

interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: "Collections", path: "/" },
  { name: "The Craft", path: "/craft" },
  { name: "Our Story", path: "/" },
];

const NavigationBar: React.FC = () => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  const { cartData } = useCart();
  const { user, login, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Transparent on home page, solid everywhere else or when scrolled
  const isSolid = pathname !== "/" || isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = () => {
    setIsMenuOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "unset";
    hamburgerRef.current?.focus();
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleUserSignIn = (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    setShowSignInModal(true);
  };

  const handleInputChange = (input: string) => {
    setPhoneNumber(input);
  };

  const handleSendOtp = async (phoneNumber: string) => {
    try {
      const response = await OtpService.sendOtp({ phone: phoneNumber });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Invalid phone number or rate limit reached.",
        );
      }
      setShowOTPModal(true);
    } catch (error: any) {
      console.error("Error in sending OTP: ", { error });
      notifications.show({
        title: "Error Sending OTP",
        message:
          error?.message ||
          "Failed to send authentication code. Please try again.",
        color: "red",
        radius: 0,
      });
    }
  };

  const handleModalClose = () => {
    setShowSignInModal(false);
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const signInResponse = await OtpService.verifyOtpAndSignIn({
        phone: phoneNumber,
        otp: otp,
      });

      await login(signInResponse, "phone");

      setShowSignInModal(false);
      setShowOTPModal(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Verification failed";
      notifications.show({
        title: "Sign-in Failed",
        message,
        color: "red",
        radius: 0,
      });
      throw error;
    }
  };

  return (
    <>
      <nav className={`${styles.navbar}${isSolid ? " " + styles.solid : ""}`}>
        {/* Hamburger — mobile only */}
        <button
          ref={hamburgerRef}
          onClick={toggleMenu}
          className={styles.mobileMenuButton}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <div className={styles.hamburgerIcon}>
            <span className={styles.hamburgerBar}></span>
            <span className={styles.hamburgerBar}></span>
            <span className={styles.hamburgerBar}></span>
          </div>
        </button>

        {/* Logo — left on desktop, centered on mobile */}
        <Link href="/" className={styles.brandName}>
          <Image
            src={PeacockBrown}
            alt="Qala Chowk Peacock logo"
            height={36}
            width={36}
            className={styles.brandLogo}
          />
          Qala Chowk
        </Link>

        {/* Nav links — centered via absolute positioning */}
        <div className={styles.navLinks}>
          {menuItems.map((item) => (
            <Link
              href={item.path}
              key={item.name}
              className={`${styles.navLink}${pathname === item.path ? " " + styles.active : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className={styles.navRight}>
          {/* Account */}
          <div
            className={styles.actionButtonContainer}
            onMouseEnter={() => setShowAccountPanel(true)}
            onMouseLeave={() => setShowAccountPanel(false)}
          >
            <button
              className={styles.iconBtn}
              onClick={() => setShowAccountPanel((prev) => !prev)}
              aria-label="Account"
              aria-expanded={showAccountPanel}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="currentColor"
              >
                <path d="M480-480q-66 0-113-47t-113-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-32q0-34 17.5-62.5T224-292q62-31 126-46.5T480-354q66 0 130 15.5T736-292q29 15 46.5 43.5T800-186v26H160Z" />
              </svg>
            </button>
            {showAccountPanel && (
              <div className={styles.accountDropdown} role="menu">
                <ul>
                  {user ? (
                    <>
                      <li role="none">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => router.push("/order-details")}
                        >
                          Orders
                        </button>
                      </li>
                      <li role="none">
                        <button type="button" role="menuitem" disabled>
                          Tracking link
                        </button>
                      </li>
                      <li role="none">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setShowAccountPanel(false);
                            logout();
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <li role="none">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setShowAccountPanel(false);
                          handleUserSignIn();
                        }}
                      >
                        Sign In
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button
            className={styles.iconBtn}
            onClick={() => router.push("/wishlist")}
            aria-label="Wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22px"
              viewBox="0 -960 960 960"
              width="22px"
              fill="currentColor"
            >
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-640q0-90 60-150t150-60q61 0 114.5 28.5T480-738q34-55 87.5-83.5T670-850q90 0 150 60t60 150q0 46-15.5 90T810-447.5Q771-382 705-316T538-172l-58 52Z" />
            </svg>
          </button>

          {/* Cart */}
          <button
            ref={cartButtonRef}
            className={styles.iconBtn}
            onClick={() => setIsCartOpen(true)}
            aria-label={`Cart${cartData.size > 0 ? `, ${cartData.size} item${cartData.size === 1 ? "" : "s"}` : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22px"
              viewBox="0 -960 960 960"
              width="22px"
              fill="currentColor"
            >
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
            </svg>
            <span className={styles.cartBadge} aria-hidden="true">{cartData.size}</span>
          </button>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      <FocusTrap active={isMenuOpen}>
        <div
          id="mobile-menu"
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onKeyDown={(e) => {
            if (e.key === "Escape") closeMenu();
          }}
        >
          <div className={styles.menuHeader}>
            <span className={styles.menuTitle}>Menu</span>
            <button
              onClick={closeMenu}
              className={styles.closeButton}
              aria-label="Close menu"
            >
              <span className={styles.closeBar}></span>
              <span className={styles.closeBar}></span>
            </button>
          </div>

          <div className={styles.menuItemsMobile}>
            {menuItems.map((item) => (
              <Link
                href={item.path}
                key={item.name}
                className={styles.menuItemMobile}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <button
                className={styles.menuItemMobile}
                style={{
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  closeMenu();
                  logout();
                }}
              >
                Logout
              </button>
            ) : (
              <button
                className={styles.menuItemMobile}
                style={{
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  closeMenu();
                  handleUserSignIn();
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </FocusTrap>

      {/* Modals */}
      {showSignInModal && (
        <SignInModal
          onClose={handleModalClose}
          inputChangeCallback={handleInputChange}
          sendOTPCallback={handleSendOtp}
        />
      )}
      {showOTPModal && (
        <OTPModal
          opened={true}
          handleCloseModal={() => setShowOTPModal(false)}
          phoneNumber={phoneNumber}
          verifyOtpCallback={handleVerifyOtp}
        />
      )}

      {/* Slide Cart Panel */}
      <SlidePopup
        isOpen={isCartOpen}
        backdropClickCallback={() => {
          setIsCartOpen(false);
          cartButtonRef.current?.focus();
        }}
      />
    </>
  );
};

export default NavigationBar;
