import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authed/')({
  component: RedirectToApp,
});

function RedirectToApp() {
  useEffect(() => {
    window.location.replace('/app.html');
  }, []);
  return null;
}
