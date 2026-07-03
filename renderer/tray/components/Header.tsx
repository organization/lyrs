import { useNavigate } from '@solidjs/router';
import { Box, Button } from '@suis-ui/kit';
import { ChevronLeft } from 'lucide-solid';

export interface HeaderProps {
  title?: string;
}
export const Header = (props: HeaderProps) => {
  const navigate = useNavigate();

  const onPrev = () => {
    navigate(-1);
  };

  return (
    <Box
      align="center"
      direction="row"
      gap="sm"
      h="2rem"
      justify="flex-start"
      mb="sm"
      w="100%"
    >
      <Box flex={1} text="title">
        {props.title}
      </Box>
      <Button onClick={onPrev} variant="ghost">
        <Box align="center" direction="row" gap="sm">
          <ChevronLeft size={18} />
          <span>뒤로</span>
        </Box>
      </Button>
    </Box>
  );
};
