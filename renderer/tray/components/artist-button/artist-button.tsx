import { useTransContext } from '@jellybrick/solid-i18next';
import {
  Box,
  Button,
  createClickAway,
  Input,
  Popup,
  token,
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
      element={
        <Box
          align={'flex-end'}
          bc={'surface.higher'}
          bd={'md'}
          bg={'surface.main'}
          gap={'sm'}
          p={'sm'}
          r={'lg'}
          ref={(el) => onCleanup(register(el))}
          shadow={'lg'}
        >
          <Input
            onChange={(e) => setValue(e.target.value)}
            placeholder={t('lyrics.artist')}
            value={value()}
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
      open={open()}
      placement={'bottom-end'}
    >
      <Button
        onClick={() => setOpen(!open())}
        r={'sm'}
        size={'sm'}
        type={'icon'}
        variant="ghost"
      >
        <UserRoundSearch size={token.size['1']} />
      </Button>
    </Popup>
  );
};
