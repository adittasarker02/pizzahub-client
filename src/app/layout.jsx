import './globals.css';
import { Providers } from '@/components/providers';

export const metadata = {
  title: { default: 'PizzaHub — Hot & Fresh Pizza Delivered', template: '%s · PizzaHub' },
  description:
    'PizzaHub connects pizza lovers with local pizzerias. Browse menus, order your favourites and track every order — all in one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
