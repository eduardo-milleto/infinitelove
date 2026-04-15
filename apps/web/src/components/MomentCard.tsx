import type { MomentDto } from '@infinitelove/shared';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../lib/api';

export interface MomentCardProps {
  moment: MomentDto;
}

export function MomentCard({ moment }: MomentCardProps) {
  const cover = moment.photos[0];
  const when = format(new Date(moment.happenedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const excerpt =
    moment.story.length > 180 ? `${moment.story.slice(0, 180).trim()}…` : moment.story;

  return (
    <Link
      to="/moments/$id"
      params={{ id: moment.id }}
      className="card card-hoverable block overflow-hidden p-0"
    >
      {cover ? (
        <div
          className="relative w-full bg-sand"
          style={{ aspectRatio: `${cover.width} / ${cover.height}`, maxHeight: '24rem' }}
        >
          <img
            src={api.photoUrl(cover.id)}
            alt={moment.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {moment.photos.length > 1 && (
            <span className="chip chip-sand absolute top-3 right-3 shadow-sm">
              +{moment.photos.length - 1} foto{moment.photos.length - 1 > 1 ? 's' : ''}
            </span>
          )}
        </div>
      ) : (
        <div className="w-full bg-sand grid place-items-center" style={{ aspectRatio: '16 / 9' }}>
          <span className="overline">sem foto</span>
        </div>
      )}
      <div className="p-5 md:p-6">
        <span className="overline">{when}</span>
        <h3 className="font-serif text-xl md:text-2xl mt-1 mb-2 text-near-black">{moment.title}</h3>
        <p className="serif-body text-olive-gray">{excerpt}</p>
        {moment.memeCaption && (
          <div className="mt-3">
            <span className="chip">"{moment.memeCaption}"</span>
          </div>
        )}
      </div>
    </Link>
  );
}
