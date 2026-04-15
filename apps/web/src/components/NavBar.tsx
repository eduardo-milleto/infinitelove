import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from '../lib/auth-client';
import { PixelButton } from './PixelButton';

export function NavBar() {
  const { data } = useSession();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const user = data?.user;

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-parchment/80 border-b border-border-cream">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>🌻</span>
          <span className="font-serif text-xl">infinite love</span>
        </Link>
        <nav className="flex items-center gap-2">
          {user && (
            <>
              <Link
                to="/moments/new"
                className="hidden md:inline-flex btn btn-secondary no-underline"
              >
                + novo momento
              </Link>
              <span className="chip chip-sand hidden sm:inline-flex">
                <span aria-hidden>👋</span> {user.name}
              </span>
              <PixelButton
                variant="ghost"
                onPress={async () => {
                  await signOut();
                  qc.clear();
                  navigate({ to: '/login' });
                }}
              >
                sair
              </PixelButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
