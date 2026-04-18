import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '../lib/auth-client';

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
  component: () => <Outlet />,
});
