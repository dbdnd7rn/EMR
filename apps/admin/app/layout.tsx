import './globals.css';

export const metadata = {
  title: 'EnVizion Life Admin',
  description: 'Content management portal for the EnVizion Life Digital Caregiver Toolkit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
