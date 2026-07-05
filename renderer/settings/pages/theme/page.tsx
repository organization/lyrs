import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { useNavigate } from '@solidjs/router';
import { Button, Input } from '@suis-ui/kit';
import { Check } from 'lucide-solid';
import { For, Show, createSignal, type JSX } from 'solid-js';

import { DEFAULT_STYLE } from '../../../../common/constants';
import presetThemes from '../../../../common/presets';
import { type StyleConfig } from '../../../../common/schema';
import Card from '../../../components/Card';
import * as componentStyles from '../../../components/components.css';
import Modal from '../../../components/Modal';
import useThemeList from '../../../hooks/useThemeList';
import {
  CardRow,
  CardTitle,
  CheckPlaceholder,
  CodeBlock,
  EmptyState,
  iconSuccessProps,
  ModalBody,
  ModalTitle,
  PageRoot,
  PageTitle,
  SectionTitle,
  Spacer,
} from '../../components/setting-layout';

export const ThemeListPage = () => {
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
    <PageRoot>
      <PageTitle>
        <Trans key={'setting.title.theme'} />
      </PageTitle>
      <SectionTitle>
        <Trans key={'setting.theme.built-in-themes'} />
      </SectionTitle>
      <For each={Object.keys(presetThemes)}>
        {(name) => (
          <Card>
            <CardTitle>
              <Trans key={`setting.theme.preset.${name}`} />
            </CardTitle>
            <Spacer />
            <Button
              onClick={(event) => {
                setTarget(name);
                onAdd();
                event.stopPropagation();
              }}
              variant="primary"
            >
              <Trans key={'setting.theme.add-theme-from'} />
            </Button>
          </Card>
        )}
      </For>
      <SectionTitle>
        <Trans key={'setting.theme.available-themes'} />
      </SectionTitle>
      <Show when={Object.keys(themeList()).length === 0}>
        <EmptyState>
          <Trans key={'setting.theme.no-available-themes'} />
        </EmptyState>
      </Show>
      <For each={Object.keys(themeList())}>
        {(name) => (
          <Card
            subCards={[
              <CardRow>
                <Button
                  class={componentStyles.dangerButton}
                  onClick={() => onDelete(name)}
                  variant="primary"
                >
                  <Trans key={'setting.theme.delete-theme'} />
                </Button>
                <Spacer />
                <Button onClick={() => onRename(name)} variant="ghost">
                  <Trans key={'setting.theme.rename-theme'} />
                </Button>
              </CardRow>,
            ]}
          >
            <CardTitle>{name}</CardTitle>
            <Spacer />
            <Button
              onClick={(event) => {
                onThemeSetting(name);
                event.stopPropagation();
              }}
              variant="primary"
            >
              <Trans key={'setting.theme.edit-theme'} />
            </Button>
          </Card>
        )}
      </For>
      <SectionTitle>
        <Trans key={'setting.theme.edit-theme'} />
      </SectionTitle>
      <Card>
        <Trans key={'setting.theme.add-theme'} />
        <Spacer />
        <Button onClick={onShowAdd} variant="primary">
          <Trans key={'setting.theme.add-theme'} />
        </Button>
      </Card>
      <Card>
        <Trans key={'setting.theme.import-theme'} />
        <Spacer />
        <label>
          <Button as="span" variant="primary">
            <Trans key={'setting.theme.import-from-file'} />
          </Button>
          <input
            accept={'application/json'}
            hidden
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
        <ModalTitle>{t('setting.theme.rename-alert-title')}</ModalTitle>
        <ModalBody>
          {t('setting.theme.rename-alert', { name: target() })}
        </ModalBody>
        <Input
          onChange={(event) => setName(event.target.value)}
          value={name()}
          w="100%"
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
        <ModalTitle>
          {t('common.delete.confirm', { name: target() })}
        </ModalTitle>
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
        <ModalTitle>{t('setting.theme.rename-conflict-title')}</ModalTitle>
        <ModalBody>
          {t('setting.theme.rename-conflict', { name: name() })}
        </ModalBody>
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
        <ModalTitle>{t('setting.theme.import-theme-failed')}</ModalTitle>
        <CardTitle>
          {error()?.name}
          {': '}
          {error()?.message}
        </CardTitle>
        <CodeBlock>
          <code>{JSON.stringify(error(), null, 2)}</code>
        </CodeBlock>
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
        <ModalTitle>{t('setting.theme.add-theme-from.title')}</ModalTitle>
        <Trans key={'setting.theme.built-in-themes'} />
        <For each={Object.keys(presetThemes)}>
          {(name) => (
            <Card onClick={() => setTarget(name)}>
              <Show fallback={<CheckPlaceholder />} when={target() === name}>
                <Check {...iconSuccessProps} />
              </Show>
              <CardTitle>
                <Trans key={`setting.theme.preset.${name}`} />
              </CardTitle>
              <Spacer />
            </Card>
          )}
        </For>
        <SectionTitle>
          <Trans key={'setting.theme.custom-themes'} />
        </SectionTitle>
        <For each={Object.keys(themeList())}>
          {(name) => (
            <Card onClick={() => setTarget(name)}>
              <Show fallback={<CheckPlaceholder />} when={target() === name}>
                <Check {...iconSuccessProps} />
              </Show>
              <CardTitle>{name}</CardTitle>
              <Spacer />
            </Card>
          )}
        </For>
      </Modal>
    </PageRoot>
  );
};
