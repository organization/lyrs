import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body, #app', {
  width: '100%',
  height: '100%',
  padding: 0,
  margin: 0,
});

globalStyle('html', {
  fontFamily:
    "'Pretendard JP Variable', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
});

globalStyle(':where(*)', {
  boxSizing: 'border-box',
});

globalStyle('button:not(:disabled), [role="button"]:not(:disabled)', {
  cursor: 'pointer',
});
