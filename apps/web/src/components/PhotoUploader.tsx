import { ALLOWED_IMAGE_MIME, MAX_UPLOAD_BYTES } from '@infinitelove/shared';
import { useState, useRef } from 'react';
import { PixelButton } from './PixelButton';

export interface PhotoUploaderProps {
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  files: File[];
}

const ALLOWED = new Set<string>(ALLOWED_IMAGE_MIME);

export function PhotoUploader({ onFilesChange, disabled, files }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: File[]) => {
    setError(null);
    const valid: File[] = [];
    for (const f of incoming) {
      if (!ALLOWED.has(f.type)) {
        setError(`formato não suportado: ${f.name}`);
        continue;
      }
      if (f.size > MAX_UPLOAD_BYTES) {
        setError(`muito grande: ${f.name}`);
        continue;
      }
      valid.push(f);
    }
    if (valid.length === 0) return;
    onFilesChange([...files, ...valid].slice(0, 20));
  };

  const removeAt = (i: number) => {
    const next = files.slice();
    next.splice(i, 1);
    onFilesChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        className={`card card-hoverable cursor-pointer text-center py-10 border-dashed ${
          dragging ? 'bg-love-wash' : ''
        }`}
        style={{ borderStyle: 'dashed', borderColor: 'var(--color-ring-warm)' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_MIME.join(',')}
          multiple
          hidden
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) addFiles(Array.from(e.target.files));
            e.currentTarget.value = '';
          }}
        />
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl" aria-hidden>🌱</span>
          <p className="font-serif text-lg">arraste fotos aqui</p>
          <p className="text-sm text-stone-gray">jpg, png ou webp · até 20MB cada</p>
        </div>
      </label>

      {error && <p className="text-sm text-[#b53333]">{error}</p>}

      {files.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((f, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                className="w-full aspect-square object-cover rounded-lg border border-border-warm"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 bg-love text-ivory rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`remover ${f.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <PixelButton variant="secondary" onPress={() => inputRef.current?.click()}>
          escolher arquivos
        </PixelButton>
      </div>
    </div>
  );
}
