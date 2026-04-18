import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Form } from 'react-aria-components';
import { authClient, signIn } from '../lib/auth-client';
import { PixelButton } from '../components/PixelButton';
import { TextField } from '../components/TextField';
import { InfiniteCounter } from '../components/InfiniteCounter';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data?.user) throw redirect({ to: '/' });
  },
  component: LoginPage,
});

// mapeia o "usuário" curto digitado no form para o e-mail real do Better Auth
function usernameToEmail(raw: string): string {
  const u = raw.trim().toLowerCase();
  if (!u) return '';
  if (u.includes('@')) return u;
  return `${u}@infinitelove.local`;
}

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn.email({ email: usernameToEmail(username), password });
    setLoading(false);
    if (res.error) {
      setError('usuário ou senha inválidos');
      return;
    }
    navigate({ to: '/' });
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-8">
      <div className="w-full max-w-2xl">
        <InfiniteCounter />
      </div>

      <section className="w-full max-w-md card-elevated">
        <div className="text-center mb-6">
          <span className="overline">entrar</span>
          <h2 className="font-serif text-2xl mt-1">bem-vindo de volta 💌</h2>
          <p className="text-sm text-olive-gray mt-1">
            só o Eduardo e a Isabella entram aqui.
          </p>
        </div>

        <Form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField
            label="usuário"
            value={username}
            onChange={setUsername}
            autoFocus
            isRequired
            placeholder="eduardo"
            autoComplete="username"
          />
          <TextField
            label="senha"
            type="password"
            value={password}
            onChange={setPassword}
            isRequired
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-[#b53333]">{error}</p>}
          <PixelButton type="submit" variant="pixel" isDisabled={loading}>
            {loading ? 'entrando…' : 'entrar 💖'}
          </PixelButton>
        </Form>
      </section>
    </main>
  );
}
