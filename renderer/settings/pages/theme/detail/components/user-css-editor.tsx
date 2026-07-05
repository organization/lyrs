import { indentWithTab } from '@codemirror/commands';
import { sass } from '@codemirror/lang-sass';
import { keymap } from '@codemirror/view';
import { Trans } from '@jellybrick/solid-i18next';
import { CodeMirror } from '@solid-codemirror/codemirror';
import { Button } from '@suis-ui/kit';
import { token, vars } from '@suis-ui/kit/css';
import { githubDarkInit } from '@uiw/codemirror-theme-github';
import { basicSetup, EditorView } from 'codemirror';
import {
  createEffect,
  createSignal,
  For,
  getOwner,
  runWithOwner,
  untrack,
} from 'solid-js';

import * as styles from './user-css-editor.css';

import { ScrollArea } from '../../../../../components/scroll-area';
import {
  userCSSSelectors,
  userCSSTransitions,
  userCSSVariables,
} from '../../../../../utils/userCSSSelectors';

const debounce = <P extends unknown[]>(
  fn: (...args: P) => void,
  timeout: number,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: P) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => fn(...args), timeout);
  };
};

export interface UserCSSEditorProps {
  css?: string | null;
  onUpdate: (value: string) => void;
}

const UserCSSEditor = (props: UserCSSEditorProps) => {
  const [initialUserCSS, setInitialUserCSS] = createSignal<string | null>(null);
  createEffect(() => {
    const userCSS = props.css;
    if (userCSS === undefined) {
      return;
    }

    const editingDraft = untrack(initialUserCSS);
    if (editingDraft === null) {
      setInitialUserCSS(userCSS ?? '');
    }
  });

  const owner = getOwner();
  const onUpdate = (value: string) => {
    // eslint-disable-next-line solid/reactivity
    runWithOwner(owner, () => props.onUpdate(value));
  };
  const onUpdateDebounced = debounce(onUpdate, 1000);

  const [editor, setEditor] = createSignal<EditorView | null>(null);
  const githubTheme = githubDarkInit({
    settings: {
      gutterBackground: '#0d1117',
      gutterBorder: 'transparent',
    },
  });

  const userCSSTheme = EditorView.theme({
    '.cm-activeLine': {
      'border-radius': vars.size.round.xs,
    },

    '.cm-activeLineGutter': {
      'background': 'transparent !important',
    },

    '.cm-content': {
      'padding-right': vars.size.space.sm,
      'min-height': `calc(${token.size['9']} * 4 + ${token.size['4']} + ${vars.size.space.md})`,
    },

    '.cm-editor': {
      'flex': 1,
      'min-width': '0',
      'padding': `${token.size['-2']} calc(${vars.size.line.thick} + ${vars.size.line.md})`,
    },

    '.cm-gutters': {
      'padding-left': vars.size.space.sm,
    },
  });

  const addCodeSnippet = (codeSnippet: string) => {
    const activeEditor = editor();
    activeEditor?.dispatch({
      changes: {
        from: activeEditor.state.selection.main.head,
        insert: codeSnippet,
      },
    });
  };

  const buildSelectorSnippet = (selector: string) => `\n${selector} {\n}`;

  const addUserCSSSelector = (selectorName: string) =>
    addCodeSnippet(buildSelectorSnippet(`lyrs-${selectorName}`));

  const addUserCSSTransition = (transitionName: string) => {
    const transitionClasses = [
      `lyrs-${transitionName}-enter`,
      `lyrs-${transitionName}-exit-to`,
      `lyrs-${transitionName}-move`,
      `lyrs-${transitionName}-enter-active, lyrs-${transitionName}-exit-active`,
    ];

    addCodeSnippet(transitionClasses.map(buildSelectorSnippet).join('\n'));
  };

  const addUserCSSVariable = (variableName: string) =>
    addCodeSnippet(`var(${variableName})`);

  return (
    <>
      <div>
        <b>
          <Trans key={'setting.user-css-warning.bold'} />
        </b>{' '}
        <Trans key={'setting.user-css-warning.0'} />
        <br />
        <br />
        <Trans key={'setting.user-css-warning.1'} />
      </div>

      <ScrollArea
        align="stretch"
        class={styles.toolbarScroller}
        direction="column"
        fadeAxes="x"
        overflow="xAuto"
      >
        <div class={styles.toolbar}>
          <For each={Object.keys(userCSSSelectors)}>
            {(selectorName) => (
              <Button
                onClick={() => addUserCSSSelector(selectorName)}
                variant="ghost"
              >
                {selectorName}
              </Button>
            )}
          </For>

          <For each={Object.keys(userCSSTransitions)}>
            {(transitionName) => (
              <Button
                onClick={() => addUserCSSTransition(transitionName)}
                variant="ghost"
              >
                {transitionName}
              </Button>
            )}
          </For>

          <For each={Object.entries(userCSSVariables)}>
            {([variableName, variableValue]) => (
              <Button
                onClick={() => addUserCSSVariable(variableValue)}
                variant="ghost"
              >
                {variableName}
              </Button>
            )}
          </For>
        </div>
      </ScrollArea>

      <CodeMirror
        class={styles.editor}
        extensions={[basicSetup, sass(), keymap.of([indentWithTab])]}
        onEditorMount={setEditor}
        onValueChange={onUpdateDebounced}
        theme={[githubTheme, userCSSTheme]}
        value={initialUserCSS() ?? ''}
      />
    </>
  );
};

export default UserCSSEditor;
