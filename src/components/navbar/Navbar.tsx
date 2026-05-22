"use client";

import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import SlidePopup from "@/components/slide_popup/SlidePopup";
import { useCart, useWishlist } from "@/context/CartContext";
import { useAuth } from "@/context/SupabaseAuthContext";
import SignInModal from "@/components/modal/SignIn";
import OTPModal from "@/components/modal/OTPVerification";
import { OtpService } from "@/lib/api/otpService";
import { notifications } from "@mantine/notifications";
import UserStroke from "@/assets/svgs/user_stroke.svg";
import UserFill from "@/assets/svgs/user_fill.svg";
import Gulchharre from "@/assets/svgs/gulchharre.svg";
import Image from "next/image";

interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: "Necklaces", path: "/categories/necklaces" },
  { name: "Earrings", path: "/categories/earrings" },
  { name: "Rings", path: "/categories/rings" },
  { name: "See how your jewelry is made", path: "/craft" },
];

const NavigationBar: React.FC = () => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { cartData } = useCart();
  const { wishlistData } = useWishlist();
  const { user, login, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

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
      <nav
        className={`${styles.navbar}${isScrolled ? " " + styles.visible : ""}`}
      >
        {/* Menu trigger — always visible (left) */}
        <button
          onClick={openMenu}
          className={styles.menuTrigger}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.menuTriggerIcon} aria-hidden="true">
            <span></span>
            <span></span>
          </span>
          <span className={styles.menuTriggerLabel}>Menu</span>
        </button>

        {/* Brand wordmark — centered */}
        <Link href="/" className={styles.brandName} aria-label="Gulchharre">
          <Image
            src={Gulchharre}
            alt="Gulchharre"
            priority
            className={styles.brandLogoImg}
          />
        </Link>

        {/* Right icons */}
        <div className={styles.navRight}>
          <button
            className={styles.iconBtn}
            onClick={
              user ? () => router.push("/order-details") : handleUserSignIn
            }
            aria-label={user ? "Account" : "Sign in"}
          >
            {user ? (
              <Image src={UserFill} alt="" height={22} width={22} />
            ) : (
              <Image src={UserStroke} alt="" height={22} width={22} />
            )}
          </button>

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
            {wishlistData.size > 0 && (
              <span className={styles.cartBadge}>{wishlistData.size}</span>
            )}
          </button>

          <button
            className={styles.iconBtn}
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
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
            {cartData.size > 0 && (
              <span className={styles.cartBadge}>{cartData.size}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Slide-out menu (from left) */}
      <div
        className={`${styles.menuBackdrop} ${isMenuOpen ? styles.backdropOpen : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <aside
        className={`${styles.menuPanel} ${isMenuOpen ? styles.menuPanelOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!isMenuOpen}
      >
        <button
          onClick={closeMenu}
          className={styles.closeButton}
          aria-label="Close menu"
        >
          <span className={styles.closeBar}></span>
          <span className={styles.closeBar}></span>
        </button>

        <nav className={styles.menuList} aria-label="Primary">
          {menuItems.map((item, idx) => (
            <Link
              href={item.path}
              key={`${item.name}-${idx}`}
              className={`${styles.menuItem}${pathname === item.path ? " " + styles.menuItemActive : ""}`}
              style={{ ["--idx" as any]: idx }}
              onClick={closeMenu}
            >
              <span className={styles.menuItemDot} aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div
          className={styles.menuFooter}
          style={{ ["--idx" as any]: menuItems.length }}
        >
          {user ? (
            <>
              <button
                type="button"
                className={styles.menuFooterLink}
                onClick={() => {
                  closeMenu();
                  router.push("/order-details");
                }}
              >
                Orders
              </button>
              <button
                type="button"
                className={styles.menuFooterLink}
                onClick={() => {
                  closeMenu();
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.menuFooterLink}
              onClick={() => {
                closeMenu();
                handleUserSignIn();
              }}
            >
              Sign In
            </button>
          )}
          <Link
            href="/contact"
            className={styles.menuFooterLink}
            onClick={closeMenu}
          >
            Contact us
          </Link>
        </div>
      </aside>

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
        backdropClickCallback={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default NavigationBar;
