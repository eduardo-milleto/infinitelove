import { RELATIONSHIP_START_ISO } from '@infinitelove/shared';
import { useRelationshipDuration } from '../hooks/useRelationshipDuration';

function pad(n: number, width = 2): string {
  return n.toString().padStart(width, '0');
}

export function InfiniteCounter() {
  const d = useRelationshipDuration(RELATIONSHIP_START_ISO);

  return (
    <div className="relative overflow-hidden pixel-frame p-6 md:p-8">
      <div className="flex flex-col items-center text-center gap-4">
        <span className="overline">amor infinito · since 18 abr 2025</span>

        <h1 className="font-serif text-3xl md:text-5xl text-near-black max-w-2xl">
          Eduardo <span className="counter-digit text-xl md:text-3xl align-middle mx-2">♥</span> Isabella
        </h1>

        <div className="flex flex-wrap justify-center items-baseline gap-x-3 gap-y-2">
          <Unit value={d.years} label="anos" />
          <Sep />
          <Unit value={d.months} label="meses" />
          <Sep />
          <Unit value={d.days} label="dias" />
          <Sep />
          <Unit value={pad(d.hours)} label="h" compact />
          <Sep />
          <Unit value={pad(d.minutes)} label="m" compact />
          <Sep />
          <Unit value={pad(d.seconds)} label="s" compact pulse />
        </div>

        <p className="serif-body max-w-lg italic text-olive-gray">
          {d.totalSeconds.toLocaleString('pt-BR')} segundos amando você.
        </p>
      </div>
    </div>
  );
}

function Unit({
  value,
  label,
  compact,
  pulse,
}: {
  value: number | string;
  label: string;
  compact?: boolean;
  pulse?: boolean;
}) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span
        className="counter-digit"
        style={{
          fontSize: compact ? '1.5rem' : '2rem',
          opacity: pulse ? undefined : 1,
          animation: pulse ? 'counterPulse 1s ease-in-out infinite' : undefined,
        }}
      >
        {value}
      </span>
      <span className="text-stone-gray text-xs md:text-sm font-sans">{label}</span>
      <style>{`@keyframes counterPulse { 0%,100%{opacity:1} 50%{opacity:.65} }`}</style>
    </span>
  );
}

function Sep() {
  return <span className="text-warm-silver select-none">·</span>;
}
