import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Avatar Demo",
  description: "Interactive Avatar Demo using Next.js and TypeScript",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
        <style>{`
          body {
            background-color: #11191f;
            color: #ffffff;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
