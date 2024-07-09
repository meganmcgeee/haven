import { Await, Link, useLocation } from "@remix-run/react";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import { Suspense, useEffect, useState } from "react";
import useWindowScroll from "react-use/esm/useWindowScroll";
import { PredictiveSearch } from "~/components/predictive-search/PredictiveSearch";
import { type EnhancedMenu } from "~/lib/utils";
import { useRootLoaderData } from "~/root";
import { Drawer, useDrawer } from "../Drawer";
import { IconAccount, IconLogin, IconSearch } from "../Icon";
import { Logo } from "../Logo";
import { CartCount } from "./CartCount";
import { DesktopMenu } from "./menu/DesktopMenu";

export function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
}) {
  const { y } = useWindowScroll();
  // get theme settings
  let settings = useThemeSettings();
  let [hovered, setHovered] = useState(false);
  let { isOpen, openDrawer, closeDrawer } = useDrawer();

  let onHover = () => !hovered && setHovered(true);
  let onLeave = () => setHovered(false);
  let handleCloseDrawer = () => {
    closeDrawer();
    setTimeout(() => {
      onLeave();
    }, 200);
  };

  let enableTransparent = settings?.enableTransparentHeader && isHome;
  let isTransparent = enableTransparent && y < 50 && !isOpen && !hovered;
  return (
    <header
      role="banner"
      className={clsx(
        enableTransparent ? "fixed w-screen" : "sticky",
        isTransparent
          ? "text-primary bg-transparent"
          : "shadow-header text-body bg-primary",
        "transition-all duration-300 ease-in-out",
        "h-nav hidden lg:flex items-center z-40 top-0 justify-between leading-none gap-8",
        "px-6 md:px-8 lg:px-12",
      )}
      onMouseOver={onHover}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
    >
      <Logo showTransparent={isTransparent} />
      {menu && <DesktopMenu menu={menu} />}
      <div className="flex items-center gap-1 z-30">
        <SearchToggle
          isOpen={isOpen}
          openDrawer={openDrawer}
          closeDrawer={handleCloseDrawer}
        />
        <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function AccountLink({ className }: { className?: string }) {
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={className}>
      <Suspense fallback={<IconLogin />}>
        <Await resolve={isLoggedIn} errorElement={<IconAccount />}>
          {(isLoggedIn) => (isLoggedIn ? <IconAccount /> : <IconAccount />)}
        </Await>
      </Suspense>
    </Link>
  );
}

function SearchToggle({ isOpen, openDrawer, closeDrawer }: any) {
  let { pathname } = useLocation();
  useEffect(() => {
    if (isOpen) {
      closeDrawer();
    }
  }, [pathname]);
  return (
    <>
      <button
        onClick={openDrawer}
        className="relative flex h-8 w-8 items-center justify-center focus:ring-primary/5"
      >
        <IconSearch className="h-6 w-6 !font-extralight" />
      </button>
      <Drawer open={isOpen} onClose={closeDrawer} openFrom="top">
        <PredictiveSearch isOpen={isOpen} />
      </Drawer>
    </>
  );
}
