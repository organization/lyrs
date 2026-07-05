import { Trans, useTransContext } from '@jellybrick/solid-i18next';
import { Button } from '@suis-ui/kit';
import { createSignal, For } from 'solid-js';

import ViewCard from './components/view-card';
import ViewRenameModal from './components/view-rename-modal';

import { DEFAULT_CONFIG } from '../../../../common/constants';
import Card from '../../../components/Card';
import useConfig from '../../../hooks/useConfig';
import useGameList from '../../../hooks/useGameList';
import useThemeList from '../../../hooks/useThemeList';
import {
  PageRoot,
  PageTitle,
  SectionTitle,
  Spacer,
} from '../../components/setting-layout';

export const ViewPage = () => {
  const [config, setConfig] = useConfig();
  const [themeList] = useThemeList();
  const [gameList, setGameList] = useGameList();
  const [t] = useTransContext();

  const [expand, setExpand] = createSignal(-1);
  const [target, setTarget] = createSignal<string | null>(null);
  const [name, setName] = createSignal('');
  const [nameConflictOpen, setNameConflictOpen] = createSignal(false);

  const views = () => config()?.views ?? [];

  const onAddView = () => {
    const newName = t('setting.view.new-view');
    let suffix = 1;

    while (views().some((view) => view.name === `${newName} ${suffix}`)) {
      suffix += 1;
    }

    setConfig({
      views: [
        ...views(),
        {
          ...DEFAULT_CONFIG.views[0],
          name: `${newName} ${suffix}`,
        },
      ],
    });
  };
  const onRenameView = () => {
    const targetName = target();
    const newName = name();

    if (!targetName || !newName) return;
    const newViews = [...views()];
    const targetIndex = newViews.findIndex((view) => view.name === targetName);
    const newNameConflict = newViews.some((view) => view.name === newName);

    if (targetIndex < 0) return;
    if (newNameConflict) {
      setNameConflictOpen(true);
      return;
    }
    newViews[targetIndex].name = newName;

    const newGameList = { ...gameList() };
    if (newGameList[targetName]) {
      newGameList[newName] = newGameList[targetName];
      delete newGameList[targetName];

      setGameList(newGameList, false);
    }

    setConfig({
      views: newViews,
    });
    setTarget(null);
  };

  return (
    <PageRoot>
      <PageTitle>
        <Trans key={'setting.title.view'} />
      </PageTitle>
      <SectionTitle>
        <Trans key={'setting.view.list'} />
      </SectionTitle>
      <For each={views()}>
        {(view, index) => (
          <ViewCard
            expanded={expand() === index()}
            onExpand={(isExpand) => {
              if (isExpand) setExpand(index());
              else setExpand(-1);
            }}
            onRename={() => setTarget(view.name)}
            onViewsChange={(views) => setConfig({ views })}
            themeList={themeList()}
            view={view}
            viewIndex={index()}
            views={views()}
          />
        )}
      </For>

      <SectionTitle>
        <Trans key={'setting.view.edit-view'} />
      </SectionTitle>
      <Card>
        <Trans key={'setting.view.add-view'} />
        <Spacer />
        <Button onClick={onAddView} variant="primary">
          <Trans key={'setting.view.add-view'} />
        </Button>
      </Card>

      <ViewRenameModal
        conflictOpen={nameConflictOpen()}
        name={name()}
        onClose={() => setTarget(null)}
        onCloseConflict={() => setNameConflictOpen(false)}
        onConfirm={onRenameView}
        onNameChange={setName}
        target={target()}
      />
    </PageRoot>
  );
};
