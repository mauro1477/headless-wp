// import './globals.css';
import AuthBar from '../components/AuthBar';

export const metadata = { title: 'Headless WP' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthBar />
        {children}
      </body>
    </html>
  );
}
