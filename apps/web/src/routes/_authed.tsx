import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '../lib/auth-client';
import { NavBar } from '../components/NavBar';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    const { data } = await authClient.getSession();
    if (!data?.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <>
      <NavBar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-border-cream py-6 text-center">
        <span className="overline">feito com 💖 pelo Eduardo · pra sempre Isabella</span>
      </footer>
    </>
  );
}
