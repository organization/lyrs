import { useTransContext } from '@jellybrick/solid-i18next';
import {
  Box,
  Button,
  createClickAway,
  Input,
  Popup,
  Tooltip,
} from '@suis-ui/kit';
import { UserRoundSearch } from 'lucide-solid';
import { createEffect, createSignal, onCleanup } from 'solid-js';

type ArtistButtonProps = {
  artist: string;
  onChange: (artist: string) => void;
};
export const ArtistButton = (props: ArtistButtonProps) => {
  const [t] = useTransContext();

  const [value, setValue] = createSignal(props.artist);
  const [open, setOpen] = createSignal(false);

  const register = createClickAway(() => setOpen(false));

  createEffect(() => {
    setValue(props.artist);
  });

  return (
    <Popup
      open={open()}
      placement={'bottom-end'}
      element={
        <Box
          ref={(el) => onCleanup(register(el))}
          bg={'surface.main'}
          bd={'md'}
          bc={'surface.higher'}
          p={'sm'}
          r={'lg'}
          shadow={'lg'}
          gap={'sm'}
          align={'flex-end'}
        >
          <Input
            value={value()}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t('lyrics.artist')}
          />
          <Button
            onClick={() => {
              setOpen(false);
              props.onChange(value());
            }}
          >
            {t('common.okay')}
          </Button>
        </Box>
      }
    >
      <Button
        type={'icon'}
        variant="ghost"
        size={'sm'}
        r={'sm'}
        onClick={() => setOpen(!open())}
      >
        <UserRoundSearch size={16} />
      </Button>
    </Popup>
  );
};
