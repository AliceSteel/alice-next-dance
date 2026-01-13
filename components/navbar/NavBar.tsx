"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "@/store/slices/modal/modalSlice";
import type { RootState } from "@/store/store";

import type { NavbarProps } from "./NavBarTypes";
import Modal from "@/components/Modal";
import LoginForm from "@/components/loginForm/LoginForm";
import Sidemenu from "@/components/sidemenu/Sidemenu";
import BasketDrawer from "@/components/basketDrawer/BasketDrawer";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import MembershipDialog from "@/components/dialogs/MembershipDialog";
import { openBasketDrawer } from "@/store/slices/cart/cartSlice";

function NavBar({ title, menuItemsLeft, menuItemsRight }: NavbarProps) {
  const dispatch = useDispatch();
  //const { pathname } = location;
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const { type } = useSelector((state: RootState) => state.modal);
  const totalQtyItems = useSelector(
    (state: RootState) => state.cart.totalQtyItems
  );

  const alreadyMounted = useRef(false);

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

    const authItem = userName
      ? { id: "auth", title: `Hi, ${first(userName)}`, link: "/account" }
      : {
          id: "auth",
          title: "Login",
          onClick: () => dispatch(openModal("login")),
        };

    const rightWithBasket = menuItemsRight.map((item) =>
      item.link === "/basket"
        ? {
            ...item,
            title: totalQtyItems ? `Basket (${totalQtyItems})` : "Basket",
            onClick: () => dispatch(openBasketDrawer()),
          }
        : item
    );

    return {
      rightDesktop: [...rightWithBasket, authItem],
      mergedMobileRight: [...menuItemsLeft, ...rightWithBasket, authItem],
    };
  }, [userName, totalQtyItems /* dispatch */]);

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

  const titleText = (title ?? "Alice Studio").trim();
  const [firstWord, ...restWords] = titleText.split(/\s+/);
  const firstLetter = firstWord.charAt(0);
  const tail = restWords.join(" ");

  return (
    <>
      <nav
        onMouseEnter={() => {
          setIsDesktopOpen(true);
        }}
        ref={navRef}
        className="group fixed z-20 top-0 w-screen md:px-6 py-4 flex justify-between items-start gap-1"
      >
        {" "}
        <div className="hidden md:block">
          <Sidemenu
            position="left"
            menuItems={menuItemsLeft}
            isOpen={isDesktopOpen}
          />
        </div>
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl uppercase h-full font-semibold flex justify-center items-center rounded-lg overflow-hidden transition-all duration-500 ease-in-out backdrop-blur-sm pl-6 md:pl-0"
          title="Home"
        >
          {/* Mobile/tablet: static FirstLetter.Tail (no animation) */}
          <span className="md:hidden">
            <span className="inline-block">{firstLetter}</span>
            <span aria-hidden="true" className="inline-block">
              .
            </span>
            <span className="inline-block">{tail}</span>
          </span>

          {/* Desktop (md+): animated brand */}
          <span className="hidden md:flex items-center">
            <span
              className="
        inline-block overflow-hidden whitespace-nowrap
        md:transition-[width] md:duration-500 md:ease-in
        md:w-[4.25rem]
        md:group-[.scrolled]:w-[0.875rem]
        md:group-[.scrolled]:font-bold
        md:group-[.scrolled]:opacity-50
      "
            >
              {firstWord}
            </span>
            <span
              aria-hidden="true"
              className="
        inline-block
        md:transition-opacity md:duration-300 md:ease-in-out
        md:opacity-0 md:delay-0
        md:group-[.scrolled]:opacity-50 md:group-[.scrolled]:delay-150
      "
            >
              .
            </span>
            <span className="inline-block md:group-[.scrolled]:opacity-50">
              {tail}
            </span>
          </span>
        </Link>
        {/* MOBILE RIGHT MENU */}
        <div className="flex flex-col items-end md:hidden pr-3 max-w-1/2">
          {!isMobileMenuOpen && <span>☰</span> /* Hamburger icon */}
          {isMobileMenuMounted && (
            <Sidemenu
              position="right"
              menuItems={mergedMobileRight}
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuMounted(false)}
            />
          )}
        </div>
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
