import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { PixelButton } from './PixelButton';

export interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <DialogTrigger>
      {trigger}
      <ModalOverlay className="modal-overlay" isDismissable>
        <Modal className="modal-panel">
          <Dialog className="outline-none">
            {({ close }) => (
              <div className="flex flex-col gap-4">
                <Heading slot="title" className="font-serif text-2xl">
                  {title}
                </Heading>
                {description && <p className="serif-body">{description}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <Button className="btn btn-ghost" onPress={close}>
                    {cancelLabel}
                  </Button>
                  <PixelButton
                    variant={destructive ? 'love' : 'primary'}
                    onPress={async () => {
                      await onConfirm();
                      close();
                    }}
                  >
                    {confirmLabel}
                  </PixelButton>
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
