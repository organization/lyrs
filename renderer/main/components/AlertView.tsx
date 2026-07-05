import { Trans } from '@jellybrick/solid-i18next';
import { token, vars } from '@suis-ui/kit/css';

import { useClassStyle } from '../../hooks/useClassStyle';
import useServer from '../../hooks/useServer';
import { userCSSSelectors } from '../../utils/userCSSSelectors';

export const AlertView = () => {
  const [state] = useServer();

  useClassStyle(
    userCSSSelectors.alert,
    () => `
    display: none;
    
    position: absolute;
    
    width: fit-content;
    height: fit-content;
    padding: ${token.size['2']} calc(${token.size['2']} * 2);
    border-radius: ${token.size['1']};
    
    z-index: ${vars.zIndex.dropdown};
  `,
  );
  useClassStyle(
    userCSSSelectors['alert--disconnected'],
    () => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    font-size: ${token.textSize['1']};
    color: oklch(from ${vars.color.surface.main} l c h / 0.75);
    background-image: linear-gradient(
      135deg,
      oklch(from ${vars.color.error.main} l c h / 0.2) 25%,
      oklch(from ${vars.color.error.main} l c h / 0.1) 25%,
      oklch(from ${vars.color.error.main} l c h / 0.1) 50%,
      oklch(from ${vars.color.error.main} l c h / 0.2) 50%,
      oklch(from ${vars.color.error.main} l c h / 0.2) 75%,
      oklch(from ${vars.color.error.main} l c h / 0.1) 75%
    );
    background-size: ${token.size['1']} ${token.size['1']};
    box-shadow: 0 0 0 ${vars.size.line.thick} oklch(from ${vars.color.error.main} l c h / 0.1) inset;
    
    animation: background 10s linear infinite;
  `,
  );
  useClassStyle(
    userCSSSelectors['alert--description'],
    () => `
    text-wrap: balance;
    word-break: keep-all;
    text-align: center;
    font-size: ${token.textSize['-2']};
    color: oklch(from ${vars.color.surface.main} l c h / 0.5);
  `,
  );

  return (
    <div
      classList={{
        [userCSSSelectors.alert]: true,
        [userCSSSelectors['alert--disconnected']]: state() === 'close',
      }}
    >
      <Trans key={'lyrics.disconnected'} />
      <span class={userCSSSelectors['alert--description']}>
        <Trans key={'lyrics.disconnected.description'} />
      </span>
    </div>
  );
};
