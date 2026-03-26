import "./globals.css";

export const metadata = {
  title: "Stocks Dashboard Admin",
  description: "Admin Panel for Stocks Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
