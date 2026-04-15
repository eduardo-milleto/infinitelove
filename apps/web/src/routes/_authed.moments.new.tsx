import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Form } from 'react-aria-components';
import { api } from '../lib/api';
import { PhotoUploader } from '../components/PhotoUploader';
import { PixelButton } from '../components/PixelButton';
import { TextField } from '../components/TextField';

export const Route = createFileRoute('/_authed/moments/new')({
  component: NewMomentPage,
});

function NewMomentPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [memeCaption, setMemeCaption] = useState('');
  const [happenedAt, setHappenedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [files, setFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const created = await api.createMoment({
        title,
        story,
        memeCaption: memeCaption.trim() || null,
        happenedAt: new Date(happenedAt).toISOString(),
      });
      if (files.length) {
        await api.uploadPhotos(created.id, files);
      }
      return created;
    },
    onSuccess: async (created) => {
      await qc.invalidateQueries({ queryKey: ['moments'] });
      navigate({ to: '/moments/$id', params: { id: created.id } });
    },
    onError: (err) => {
      setSubmitError(err instanceof Error ? err.message : 'erro ao salvar');
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    mutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <span className="overline">novo</span>
        <h1 className="font-serif mt-1">plantar um momento 🌼</h1>
        <p className="serif-body text-olive-gray mt-1">
          escreva a historinha, joga o meme, cola as fotos. depois a gente volta pra ler junto.
        </p>
      </header>

      <Form onSubmit={onSubmit} className="flex flex-col gap-5 card-elevated">
        <TextField
          label="título"
          value={title}
          onChange={setTitle}
          isRequired
          placeholder="nosso primeiro jantar, aquele domingo na praia, etc."
        />

        <TextField
          label="quando foi"
          type="date"
          value={happenedAt}
          onChange={setHappenedAt}
          isRequired
        />

        <TextField
          label="a historinha"
          value={story}
          onChange={setStory}
          multiline
          rows={8}
          isRequired
          placeholder="conta aí como foi…"
        />

        <TextField
          label="meme / legenda (opcional)"
          value={memeCaption}
          onChange={setMemeCaption}
          placeholder="aquela frase interna que só vocês dois entendem"
        />

        <div>
          <span className="label">fotos</span>
          <PhotoUploader files={files} onFilesChange={setFiles} disabled={mutation.isPending} />
        </div>

        {submitError && <p className="text-sm text-[#b53333]">{submitError}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <PixelButton
            variant="ghost"
            onPress={() => navigate({ to: '/' })}
            isDisabled={mutation.isPending}
          >
            cancelar
          </PixelButton>
          <PixelButton
            type="submit"
            variant="pixel"
            isDisabled={mutation.isPending || !title || !story}
          >
            {mutation.isPending ? 'plantando…' : 'plantar 💐'}
          </PixelButton>
        </div>
      </Form>
    </div>
  );
}
