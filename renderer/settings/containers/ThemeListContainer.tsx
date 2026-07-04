import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { useNavigate } from '@solidjs/router';
import { For, Show, createSignal, type JSX } from 'solid-js';

import { DEFAULT_STYLE } from '../../../common/constants';
import presetThemes from '../../../common/presets';
import { type StyleConfig } from '../../../common/schema';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import useThemeList from '../../hooks/useThemeList';

const ThemeListContainer = () => {
  const navigate = useNavigate();
  const [t] = useTransContext();
  const [themeList, setTheme] = useThemeList();

  const [nameConflictOpen, setNameConflictOpen] = createSignal(false);
  const [deleteOpen, setDeleteOpen] = createSignal(false);
  const [nameOpen, setNameOpen] = createSignal(false);
  const [target, setTarget] = createSignal<string | null>(null);
  const [name, setName] = createSignal('');
  const [open, setOpen] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [addOpen, setAddOpen] = createSignal(false);

  const onThemeSetting = (name: string) => {
    navigate(`/theme/${name}`);
  };
  const onRename = (name: string) => {
    setTarget(name);
    setName(name);
    setNameOpen(true);
  };
  const onDelete = (name: string) => {
    setTarget(name);
    setDeleteOpen(true);
  };
  const onAdd = () => {
    const newName = t('setting.theme.new-theme');
    let suffix = 1;

    while (themeList()[`${newName} ${suffix}`]) {
      suffix += 1;
    }

    const style: StyleConfig =
      themeList()[target() ?? ''] ??
      presetThemes[target() ?? ''] ??
      DEFAULT_STYLE;

    setTheme(`${newName} ${suffix}`, style);
    setAddOpen(false);
    setTarget(null);
  };

  const onRenameConfirm = () => {
    const newName = name();
    const oldName = target();

    if (typeof oldName !== 'string') return;
    const original = themeList()[oldName];

    const presetNames = Object.keys(presetThemes).map((name) =>
      t(`setting.theme.preset.${name}`),
    );
    if (themeList()[newName] || presetNames.includes(newName)) {
      setNameOpen(false);
      setNameConflictOpen(true);
      return;
    }

    setTheme(newName, original ?? null);
    setTheme(oldName, null);
    setNameOpen(false);
  };
  const onDeleteConfirm = () => {
    const name = target();
    if (typeof name !== 'string') return;

    setTheme(name, null);
    setDeleteOpen(false);
  };

  const onImportTheme: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = async (event) => {
    const file = event.target.files?.item(0);
    if (!file) return;

    try {
      const filename = file.name;
      const name = filename.replace(/\.json$/, '');
      const str = await file.text();

      const json = JSON.parse(str) as StyleConfig;
      setTheme(name, json);
    } catch (err) {
      setError(err as Error);
      setOpen(true);
    }
  };

  const onShowAdd = () => {
    setTarget('default');
    setAddOpen(true);
  };

  return (
    <div
      class={
        'flex-1 flex flex-col justify-start items-stretch gap-1 p-4 fluent-scrollbar'
      }
    >
      <div class={'text-3xl mb-1'}>
        <Trans key={'setting.title.theme'} />
      </div>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.theme.built-in-themes'} />
      </div>
      <For each={Object.keys(presetThemes)}>
        {(name) => (
          <Card class={'flex flex-row justify-start items-center gap-4'}>
            <div class={'text-md'}>
              <Trans key={`setting.theme.preset.${name}`} />
            </div>
            <div class={'flex-1'} />
            <button
              class={'btn-primary flex justify-center items-center'}
              onClick={(event) => {
                setTarget(name);
                onAdd();
                event.stopPropagation();
              }}
            >
              <Trans key={'setting.theme.add-theme-from'} />
            </button>
          </Card>
        )}
      </For>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.theme.available-themes'} />
      </div>
      <Show when={Object.keys(themeList()).length === 0}>
        <div class={'text-md text-gray-500 p-5 text-center'}>
          <Trans key={'setting.theme.no-available-themes'} />
        </div>
      </Show>
      <For each={Object.keys(themeList())}>
        {(name) => (
          <Card
            class={'flex flex-row justify-start items-center gap-4'}
            subCards={[
              <div
                class={'w-full h-full flex justify-start items-center gap-3'}
              >
                <button
                  class={'btn-error flex justify-center items-center'}
                  onClick={() => onDelete(name)}
                >
                  <Trans key={'setting.theme.delete-theme'} />
                </button>
                <div class={'flex-1'} />
                <button
                  class={'btn-text flex justify-center items-center'}
                  onClick={() => onRename(name)}
                >
                  <Trans key={'setting.theme.rename-theme'} />
                </button>
              </div>,
            ]}
          >
            <div class={'text-md'}>{name}</div>
            <div class={'flex-1'} />
            <button
              class={'btn-primary flex justify-center items-center'}
              onClick={(event) => {
                onThemeSetting(name);
                event.stopPropagation();
              }}
            >
              <Trans key={'setting.theme.edit-theme'} />
            </button>
          </Card>
        )}
      </For>
      <div class={'text-md mt-4 mb-1'}>
        <Trans key={'setting.theme.edit-theme'} />
      </div>
      <Card class={'flex flex-row justify-start items-center gap-4'}>
        <Trans key={'setting.theme.add-theme'} />
        <div class={'flex-1'} />
        <button class={'btn-primary'} onClick={onShowAdd}>
          <Trans key={'setting.theme.add-theme'} />
        </button>
      </Card>
      <Card class={'flex flex-row justify-start items-center gap-4'}>
        <Trans key={'setting.theme.import-theme'} />
        <div class={'flex-1'} />
        <label for={'import-theme'}>
          <span class={'btn-primary'}>
            <Trans key={'setting.theme.import-from-file'} />
          </span>
          <input
            accept={'application/json'}
            class={'hidden'}
            id={'import-theme'}
            onInput={onImportTheme}
            type={'file'}
          />
        </label>
      </Card>
      <Modal
        buttons={[
          {
            name: t('common.close'),
            onClick: () => setNameOpen(false),
          },
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: onRenameConfirm,
          },
        ]}
        onClose={() => setNameOpen(false)}
        open={nameOpen()}
      >
        <div class={'text-xl mb-2'}>
          {t('setting.theme.rename-alert-title')}
        </div>
        <div class={'text-md mb-1'}>
          {t('setting.theme.rename-alert', { name: target() })}
        </div>
        <input
          class={'input w-full'}
          onChange={(event) => setName(event.target.value)}
          value={name()}
        />
      </Modal>
      <Modal
        buttons={[
          {
            type: 'negative',
            name: t('common.delete'),
            onClick: onDeleteConfirm,
          },
        ]}
        onClose={() => setDeleteOpen(false)}
        open={deleteOpen()}
      >
        <div class={'text-xl'}>
          {t('common.delete.confirm', { name: target() })}
        </div>
      </Modal>
      <Modal
        buttons={[
          {
            name: t('common.okay'),
            onClick: () => {
              setNameConflictOpen(false);
              if (target()) onRename(target()!);
            },
          },
        ]}
        onClose={() => setNameConflictOpen(false)}
        open={nameConflictOpen()}
      >
        <div class={'text-xl mb-2'}>
          {t('setting.theme.rename-conflict-title')}
        </div>
        <div class={'text-md mb-1'}>
          {t('setting.theme.rename-conflict', { name: name() })}
        </div>
      </Modal>
      <Modal
        buttons={[
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: () => setOpen(false),
          },
        ]}
        onClose={() => setOpen(false)}
        open={open()}
      >
        <div class={'text-black dark:text-white text-lg'}>
          {t('setting.theme.import-theme-failed')}
        </div>
        <div class={'text-black dark:text-white font-mono'}>
          {error()?.name}
          {': '}
          {error()?.message}
        </div>
        <pre class={'text-white bg-slate-700 font-mono'}>
          <code>{JSON.stringify(error(), null, 2)}</code>
        </pre>
      </Modal>
      <Modal
        buttons={[
          {
            name: t('common.close'),
            onClick: () => setAddOpen(false),
          },
          {
            type: 'positive',
            name: t('setting.theme.add-theme-from.selected'),
            onClick: onAdd,
          },
        ]}
        onClose={() => setAddOpen(false)}
        open={addOpen()}
      >
        <div class={'text-xl mb-2'}>
          {t('setting.theme.add-theme-from.title')}
        </div>
        <Trans key={'setting.theme.built-in-themes'} />
        <For each={Object.keys(presetThemes)}>
          {(name) => (
            <Card
              class={'flex flex-row justify-start items-center gap-4'}
              onClick={() => setTarget(name)}
            >
              <Show
                fallback={<div class={'w-6 h-6'} />}
                when={target() === name}
              >
                <svg
                  class={'w-6 h-6 fill-none'}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    class={'fill-green-500'}
                    d="M4.53 12.97a.75.75 0 0 0-1.06 1.06l4.5 4.5a.75.75 0 0 0 1.06 0l11-11a.75.75 0 0 0-1.06-1.06L8.5 16.94l-3.97-3.97Z"
                  />
                </svg>
              </Show>
              <div class={'text-md'}>
                <Trans key={`setting.theme.preset.${name}`} />
              </div>
              <div class={'flex-1'} />
            </Card>
          )}
        </For>
        <div class={'text-md mt-4 mb-1'}>
          <Trans key={'setting.theme.custom-themes'} />
        </div>
        <For each={Object.keys(themeList())}>
          {(name) => (
            <Card
              class={'flex flex-row justify-start items-center gap-4'}
              onClick={() => setTarget(name)}
            >
              <Show
                fallback={<div class={'w-6 h-6'} />}
                when={target() === name}
              >
                <svg
                  class={'w-6 h-6 fill-none'}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    class={'fill-green-500'}
                    d="M4.53 12.97a.75.75 0 0 0-1.06 1.06l4.5 4.5a.75.75 0 0 0 1.06 0l11-11a.75.75 0 0 0-1.06-1.06L8.5 16.94l-3.97-3.97Z"
                  />
                </svg>
              </Show>
              <div class={'text-md'}>{name}</div>
              <div class={'flex-1'} />
            </Card>
          )}
        </For>
      </Modal>
    </div>
  );
};

export default ThemeListContainer;
