import {
  Input,
  Label,
  Text,
  TextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import clsx from 'clsx';

export interface TextFieldProps extends AriaTextFieldProps {
  label: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  multiline,
  rows = 6,
  className,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField {...props} className={clsx('flex flex-col', className)}>
      <Label className="label">{label}</Label>
      {multiline ? (
        <TextArea className="input resize-y" rows={rows} placeholder={placeholder} />
      ) : (
        <Input className="input" placeholder={placeholder} />
      )}
      {description && <Text slot="description" className="mt-1 text-xs text-stone-gray">{description}</Text>}
      {errorMessage && <Text slot="errorMessage" className="mt-1 text-xs text-[#b53333]">{errorMessage}</Text>}
    </AriaTextField>
  );
}
