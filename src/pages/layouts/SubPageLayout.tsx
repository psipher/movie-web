import { FooterView } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

export function SubPageLayout(props: { children: React.ReactNode }) {
  return (
    <div
      className="from-[#0D0D1A] to-background-main"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, var(--tw-gradient-from), var(--tw-gradient-to) 800px)",
      }}
    >
      {/* Blur elipsis */}
      <div className="absolute top-0 -right-48 rotate-[32deg] w-[50rem] h-[15rem] rounded-[70rem] bg-background-accentA blur-[100px] pointer-events-none opacity-25" />
      <div className="absolute top-0 right-48 rotate-[32deg] w-[50rem] h-[15rem] rounded-[70rem] bg-background-accentB blur-[100px] pointer-events-none opacity-25" />

      {/* Main page */}
      <FooterView>
        <Navigation noLightbar />
        <div className="mt-40">{props.children}</div>
      </FooterView>
    </div>
  );
}
