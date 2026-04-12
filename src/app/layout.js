import { FiltersProvider } from "@/context/FiltersContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FiltersProvider>{children}</FiltersProvider>
      </body>
    </html>
  );
}