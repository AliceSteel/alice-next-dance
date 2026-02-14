"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "@/store/slices/modal/modalSlice";
import type { RootState } from "@/store/store";

import type { NavbarProps } from "./NavBarTypes";
import Modal from "@/components/Modal";
import LoginForm from "@/components/loginForm/LoginForm";
import Sidemenu from "@/components/sidemenu/Sidemenu";
import BasketDrawer from "@/components/basketDrawer/BasketDrawer";

import MembershipDialog from "@/components/dialogs/MembershipDialog";
import { openBasketDrawer } from "@/store/slices/cart/cartSlice";
import Logo from "@/components/logo/Logo";
import { clearUser } from "@/store/slices/user/userSlice";
import { useClerk } from "@clerk/nextjs";
import MobileNavbar from "./components/MobileNavbar";

function NavBar({ title, menuItemsLeft, menuItemsRight }: NavbarProps) {
  const { signOut } = useClerk();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.status === "authenticated",
  );
  const { type } = useSelector((state: RootState) => state.modal);
  const totalQtyItems = useSelector(
    (state: RootState) => state.cart.totalQtyItems,
  );

  const alreadyMounted = useRef(false);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  const mobileOpenRef = useRef(isMobileMenuOpen);
  const desktopOpenRef = useRef(isDesktopOpen);

  useEffect(() => {
    mobileOpenRef.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);
  useEffect(() => {
    desktopOpenRef.current = isDesktopOpen;
  }, [isDesktopOpen]);

  useEffect(() => {
    if (!alreadyMounted.current) {
      alreadyMounted.current = true;
      return;
    }
    setIsDesktopOpen(true);
  }, [pathname]);

  const openMobileMenu = () => {
    setIsMobileMenuMounted(true);
    requestAnimationFrame(() => setIsMobileMenuOpen(true));
  };

  const { rightDesktop, mergedMobileRight } = useMemo(() => {
    const first = (n?: string) => (n ? n.split(/\s+/)[0] : undefined);

    const authItems =
      isHydrated && isLoggedIn
        ? [
            { id: "auth", title: `Hi, ${first(userName)}`, link: "/account" },
            {
              id: "signout",
              title: "Sign out",
              onClick: () => {
                void signOut();
                dispatch(clearUser());
              },
            },
          ]
        : [
            {
              id: "auth",
              title: "Login",
              onClick: () => dispatch(openModal("login")),
            },
          ];

    const rightWithBasket =
      isHydrated && isLoggedIn
        ? menuItemsRight.map((item) =>
            item.link === "/basket"
              ? {
                  ...item,
                  title: totalQtyItems ? `Basket (${totalQtyItems})` : "Basket",
                  onClick: () => dispatch(openBasketDrawer()),
                }
              : item,
          )
        : menuItemsRight.filter((item) => item.link !== "/basket");

    return {
      rightDesktop: [...rightWithBasket, ...authItems],
      mergedMobileRight: [...menuItemsLeft, ...rightWithBasket, ...authItems],
    };
  }, [
    userName,
    totalQtyItems,
    menuItemsLeft,
    menuItemsRight,
    isHydrated,
    dispatch,
    signOut,
  ]);

  useEffect(() => {
    let ticking = false;
    let lastY = window.scrollY;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const el = navRef.current;
        if (el) el.classList.toggle("scrolled", y > 10);

        const scrollingDown = y > lastY + 2;
        if (scrollingDown) {
          if (mobileOpenRef.current) setIsMobileMenuOpen(false);
          if (desktopOpenRef.current) setIsDesktopOpen(false);
        }
        lastY = y;
        ticking = false;
      });
    };

    onScroll(); // initialize
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        onMouseEnter={() => {
          setIsDesktopOpen(true);
        }}
        ref={navRef}
        className="group fixed z-20 top-0 w-full md:px-6 py-4 flex justify-between items-start gap-1"
      >
        {" "}
        <div className="hidden md:block">
          <Sidemenu
            position="left"
            menuItems={menuItemsLeft}
            isOpen={isDesktopOpen}
          />
        </div>
        <Logo title={title} />
        <MobileNavbar
          menuItems={mergedMobileRight}
          isOpen={isMobileMenuOpen}
          onOpen={openMobileMenu}
          onClose={() => setIsMobileMenuMounted(false)}
          isMounted={isMobileMenuMounted}
        />
        {/* DESKTOP RIGHT MENU */}
        <div className="hidden md:block ">
          <Sidemenu
            position="right"
            menuItems={rightDesktop}
            isOpen={isDesktopOpen}
          />
        </div>
      </nav>
      <Modal>
        {type === "login" && <LoginForm />}
        {type === "membership" && <MembershipDialog />}
      </Modal>
      <BasketDrawer />
    </>
  );
}

export default NavBar;
