import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Lightbar } from "@/components/utils/Lightbar";
import { useBannerSize } from "@/hooks/useBanner";
import { conf } from "@/setup/config";

import { BrandPill } from "./BrandPill";

export interface NavigationProps {
  children?: ReactNode;
  bg?: boolean;
  noLightbar?: boolean;
}

export function Navigation(props: NavigationProps) {
  const bannerHeight = useBannerSize();
  return (
    <>
      {!props.noLightbar ? (
        <div className="absolute inset-x-0 top-0 flex h-[88px] items-center justify-center">
          <div className="absolute inset-x-0 -mt-[22%] flex items-center sm:mt-0">
            <Lightbar />
          </div>
        </div>
      ) : null}
      <div
        className="fixed left-0 right-0 top-0 z-10 min-h-[150px]"
        style={{
          top: `${bannerHeight}px`,
        }}
      >
        <div className="fixed left-0 right-0 flex items-center justify-between px-7 py-5">
          <div
            className={`${
              props.bg ? "opacity-100" : "opacity-0"
            } absolute inset-0 block bg-background-main transition-opacity duration-300`}
          >
            <div className="pointer-events-none absolute -bottom-24 h-24 w-full bg-gradient-to-b from-background-main to-transparent" />
          </div>
          <div className="relative flex w-full items-center sm:w-fit space-x-3">
            <Link className="block" to="/">
              <BrandPill clickable />
            </Link>
            <a
              href={conf().DISCORD_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-xl text-white"
            >
              <IconPatch icon={Icons.DISCORD} clickable downsized />
            </a>
            <a
              href={conf().GITHUB_LINK}
              target="_blank"
              rel="noreferrer"
              className="text-xl text-white"
            >
              <IconPatch icon={Icons.GITHUB} clickable downsized />
            </a>
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}
