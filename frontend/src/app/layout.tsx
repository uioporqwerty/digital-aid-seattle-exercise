import type { Metadata } from "next";
import MuiProvider from "@/components/MuiProvider";

export const metadata: Metadata = {
  title: "Digital Aid Seattle - Donation Management",
  description: "Shelter donation inventory management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MuiProvider>
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}
