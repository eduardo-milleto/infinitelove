import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import type { MomentDto } from '@infinitelove/shared';
import { api } from '../lib/api';
import { HeroScene } from '../components/pixel/HeroScene';
import { MomentCard } from '../components/MomentCard';

export const Route = createFileRoute('/_authed/')({
  component: Home,
});

function Home() {
  const { data, isLoading, error } = useQuery<MomentDto[]>({
    queryKey: ['moments'],
    queryFn: api.listMoments,
  });

  return (
    <div className="flex flex-col gap-10">
      <HeroScene />

      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="overline">nossa história</span>
            <h2 className="font-serif">momentos que não esqueço</h2>
          </div>
          <Link to="/moments/new" className="btn btn-primary no-underline">
            + novo momento
          </Link>
        </div>

        {isLoading && <LoadingGrid />}

        {error && (
          <div className="card text-[#b53333]">
            não consegui carregar os momentos agora. tenta recarregar?
          </div>
        )}

        {data && data.length === 0 && <EmptyState />}

        {data && data.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {data.map((m) => (
              <MomentCard key={m.id} moment={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="card" style={{ height: 320 }}>
          <div className="animate-pulse h-full bg-sand rounded-md" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card-elevated text-center py-12">
      <div className="text-5xl mb-3" aria-hidden>🌱</div>
      <h3 className="font-serif text-2xl">ainda não plantamos nada aqui</h3>
      <p className="serif-body text-olive-gray max-w-sm mx-auto mt-2">
        que tal criar o primeiro momento? uma foto, uma historinha, aquele meme interno que só vocês
        dois entendem.
      </p>
      <div className="mt-6">
        <Link to="/moments/new" className="btn-pixel no-underline">
          plantar primeiro momento 💐
        </Link>
      </div>
    </div>
  );
}
