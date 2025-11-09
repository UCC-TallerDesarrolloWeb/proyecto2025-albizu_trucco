import { Outlet } from 'react-router-dom';
import HeaderComponent from '@components/HeaderComponent';

export default function Layout() {
  return (
    <div className="body1">
      <HeaderComponent />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer"></footer>
    </div>
  );
}
