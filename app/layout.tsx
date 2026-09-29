import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slate — A little less human. A lot more possible.",
  description: "An open-source, agent-native Linux desktop. Describe the task, keep your flow, and stay in control. Slate by BenchGrid.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
