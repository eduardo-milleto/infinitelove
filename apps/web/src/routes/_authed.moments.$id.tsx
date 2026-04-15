import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { MomentDto } from '@infinitelove/shared';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { api } from '../lib/api';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PhotoUploader } from '../components/PhotoUploader';
import { PixelButton } from '../components/PixelButton';
import { TextField } from '../components/TextField';

export const Route = createFileRoute('/_authed/moments/$id')({
  component: MomentDetail,
});

function MomentDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const query = useQuery<MomentDto>({
    queryKey: ['moments', id],
    queryFn: () => api.getMoment(id),
  });

  const deleteMut = useMutation({
    mutationFn: () => api.deleteMoment(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['moments'] });
      navigate({ to: '/' });
    },
  });

  const deletePhotoMut = useMutation({
    mutationFn: (photoId: string) => api.deletePhoto(photoId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['moments', id] }),
  });

  if (query.isLoading) return <div className="card">carregando…</div>;
  if (query.error || !query.data) {
    return (
      <div className="card text-[#b53333]">
        momento não encontrado ou não carregou.
      </div>
    );
  }

  const moment = query.data;
  const when = format(new Date(moment.happenedAt), "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  if (editing) {
    return (
      <EditMoment
        moment={moment}
        onDone={() => setEditing(false)}
        newFiles={newFiles}
        setNewFiles={setNewFiles}
      />
    );
  }

  return (
    <article className="flex flex-col gap-8">
      <header>
        <span className="overline">{when}</span>
        <h1 className="font-serif mt-2">{moment.title}</h1>
        {moment.createdByName && (
          <p className="text-sm text-stone-gray mt-1">escrito por {moment.createdByName}</p>
        )}
      </header>

      {moment.photos.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {moment.photos.map((p) => (
            <div key={p.id} className="relative group rounded-2xl overflow-hidden border border-border-cream">
              <img
                src={api.photoUrl(p.id)}
                alt=""
                className="w-full h-full object-cover"
                style={{ aspectRatio: `${p.width} / ${p.height}` }}
                loading="lazy"
              />
              <ConfirmDialog
                trigger={
                  <button
                    className="absolute top-2 right-2 btn btn-ghost bg-ivory/80 backdrop-blur opacity-0 group-hover:opacity-100 transition"
                    aria-label="remover foto"
                  >
                    remover
                  </button>
                }
                title="remover foto?"
                description="essa ação não pode ser desfeita."
                destructive
                confirmLabel="remover"
                onConfirm={() => deletePhotoMut.mutateAsync(p.id)}
              />
            </div>
          ))}
        </div>
      )}

      {moment.memeCaption && (
        <blockquote className="card-elevated italic font-serif text-xl text-center">
          "{moment.memeCaption}"
        </blockquote>
      )}

      <div className="card prose-serif">
        <p className="serif-body whitespace-pre-wrap">{moment.story}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <PixelButton variant="ghost" onPress={() => navigate({ to: '/' })}>
          ← voltar
        </PixelButton>
        <div className="flex gap-2">
          <PixelButton variant="secondary" onPress={() => setEditing(true)}>
            editar
          </PixelButton>
          <ConfirmDialog
            trigger={<PixelButton variant="love">excluir</PixelButton>}
            title="excluir esse momento?"
            description="todas as fotos também serão apagadas. essa ação não pode ser desfeita."
            destructive
            confirmLabel="excluir pra sempre"
            onConfirm={() => deleteMut.mutateAsync()}
          />
        </div>
      </div>
    </article>
  );
}

function EditMoment({
  moment,
  onDone,
  newFiles,
  setNewFiles,
}: {
  moment: MomentDto;
  onDone: () => void;
  newFiles: File[];
  setNewFiles: (f: File[]) => void;
}) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(moment.title);
  const [story, setStory] = useState(moment.story);
  const [memeCaption, setMemeCaption] = useState(moment.memeCaption ?? '');
  const [happenedAt, setHappenedAt] = useState(moment.happenedAt.slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  const saveMut = useMutation({
    mutationFn: async () => {
      await api.updateMoment(moment.id, {
        title,
        story,
        memeCaption: memeCaption.trim() || null,
        happenedAt: new Date(happenedAt).toISOString(),
      });
      if (newFiles.length) await api.uploadPhotos(moment.id, newFiles);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['moments'] });
      await qc.invalidateQueries({ queryKey: ['moments', moment.id] });
      setNewFiles([]);
      onDone();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'erro ao salvar'),
  });

  return (
    <form
      className="flex flex-col gap-5 card-elevated"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        saveMut.mutate();
      }}
    >
      <header>
        <span className="overline">editando</span>
        <h2 className="font-serif mt-1">{moment.title}</h2>
      </header>

      <TextField label="título" value={title} onChange={setTitle} isRequired />
      <TextField label="quando foi" type="date" value={happenedAt} onChange={setHappenedAt} isRequired />
      <TextField label="a historinha" value={story} onChange={setStory} multiline rows={8} isRequired />
      <TextField label="meme / legenda" value={memeCaption} onChange={setMemeCaption} />

      <div>
        <span className="label">adicionar mais fotos</span>
        <PhotoUploader files={newFiles} onFilesChange={setNewFiles} disabled={saveMut.isPending} />
      </div>

      {error && <p className="text-sm text-[#b53333]">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <PixelButton variant="ghost" onPress={onDone} isDisabled={saveMut.isPending}>
          cancelar
        </PixelButton>
        <PixelButton type="submit" variant="pixel" isDisabled={saveMut.isPending}>
          {saveMut.isPending ? 'salvando…' : 'salvar 💾'}
        </PixelButton>
      </div>
    </form>
  );
}
