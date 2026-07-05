import { Box } from '@suis-ui/kit';

import { TitleBar } from '../title-bar';

import type { JSX } from 'solid-js/jsx-runtime';

interface LayoutProps {
  children: JSX.Element;
}
const Layout = (props: LayoutProps) => {
  return (
    <Box
      align="stretch"
      bg="surface.main"
      c="text.main"
      direction="column"
      h="100%"
      overflow="hidden"
      w="100%"
    >
      <TitleBar />
      <Box flex={1} minH="0" w="100%">
        {props.children}
      </Box>
    </Box>
  );
};

export default Layout;
