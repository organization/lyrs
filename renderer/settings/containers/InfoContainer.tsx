import { Trans } from '@jellybrick/solid-i18next';
import { Button } from '@suis-ui/kit';
import { CloudDownload, ExternalLink, Info } from 'lucide-solid';
import { createSignal, Match, Switch, type JSX } from 'solid-js';

import ErrorIcon from '../../../assets/icon_error.png';
import MainIcon from '../../../assets/icon_music.png';
import packageJson from '../../../package.json';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import * as settingsStyles from '../settings.css';

import type { UpdateCheckResult } from 'electron-updater';

interface LinkCardProps {
  alt: string;
  image: string;
  title: JSX.Element;
  subtitle: JSX.Element;
  url: string;
  avatar?: boolean;
}

const ExternalIcon = () => <ExternalLink class={settingsStyles.iconSmall} />;

const LinkCard = (props: LinkCardProps) => (
  <Card onClick={() => window.open(props.url)}>
    <img
      alt={props.alt}
      class={props.avatar ? settingsStyles.avatar : settingsStyles.iconMedium}
      src={props.image}
    />
    <div class={settingsStyles.cardColumn}>
      <div class={settingsStyles.cardTitle}>{props.title}</div>
      <div class={settingsStyles.cardCaption}>{props.subtitle}</div>
    </div>
    <div class={settingsStyles.spacer} />
    <ExternalIcon />
  </Card>
);

const InfoContainer = () => {
  const [updateData, setUpdateData] = createSignal<{
    updateCheckResult: UpdateCheckResult | null;
    compareResult: 0 | 1 | -1;
    currentVersion: string;
  } | null>(null);

  const refreshUpdateData = async () => {
    const updateResult = await window.ipcRenderer.invoke('check-update');
    const currentVersion = await window.ipcRenderer.invoke(
      'get-current-version',
    );
    if (!updateResult) {
      setUpdateData({
        updateCheckResult: null,
        compareResult: 0,
        currentVersion,
      });
      return;
    }
    const compareResult = await window.ipcRenderer.invoke(
      'compare-with-current-version',
      updateResult.updateInfo.version,
    );
    setUpdateData({
      updateCheckResult: updateResult,
      compareResult,
      currentVersion,
    });
  };

  const onLink = (url: string) => {
    window.open(url);
  };

  return (
    <div class={settingsStyles.pageRoot}>
      <div class={settingsStyles.pageTitle}>
        <Trans key={'setting.title.about'} />
      </div>
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.about.support'} />
      </div>
      <LinkCard
        alt="Lyrs"
        image={MainIcon}
        subtitle="https://github.com/organization/lyrs"
        title="Lyrs"
        url="https://github.com/organization/lyrs"
      />
      <LinkCard
        alt="Bug report"
        image={ErrorIcon}
        subtitle="https://github.com/organization/lyrs/issues/new"
        title={<Trans key={'setting.about.bug-report'} />}
        url="https://github.com/organization/lyrs/issues/new"
      />
      <Card
        onClick={() => refreshUpdateData()}
        onExpand={(expand) => {
          if (expand) refreshUpdateData();
        }}
        subCards={[
          <div class={settingsStyles.cardRow}>
            <CloudDownload class={settingsStyles.iconMedium} />
            <div class={settingsStyles.cardColumn}>
              <Switch
                fallback={
                  <div class={settingsStyles.cardRow}>
                    <Spinner size="1rem" />
                    <Trans key={'setting.about.checking-for-updates'} />
                  </div>
                }
              >
                <Match when={(updateData()?.compareResult ?? 0) < 0}>
                  <div class={settingsStyles.cardTitle}>
                    <Trans key={'setting.about.update-available'} />
                  </div>
                  <div class={settingsStyles.cardCaption}>
                    <Trans
                      key={'setting.about.latest-version'}
                      options={{
                        version:
                          updateData()?.updateCheckResult?.updateInfo.version,
                      }}
                    />
                  </div>
                </Match>
                <Match when={(updateData()?.compareResult ?? 0) >= 0}>
                  <div class={settingsStyles.cardTitle}>
                    <Trans key={'setting.about.already-up-to-date'} />
                  </div>
                  <div class={settingsStyles.cardCaption}>
                    <Trans
                      key={'setting.about.current-version'}
                      options={{ version: updateData()?.currentVersion }}
                    />
                  </div>
                </Match>
              </Switch>
            </div>
            <div class={settingsStyles.spacer} />
            <Button onClick={() => refreshUpdateData()} variant="primary">
              <Trans key={'setting.about.refresh'} />
            </Button>
          </div>,
          <div
            class={settingsStyles.cardRow}
            onClick={() =>
              onLink('https://github.com/organization/lyrs/releases')
            }
          >
            <Trans key={'setting.about.visit-releases-page'} />
            <div class={settingsStyles.spacer} />
            <ExternalIcon />
          </div>,
        ]}
      >
        <Info class={settingsStyles.iconMedium} />
        <div class={settingsStyles.cardColumn}>
          <div class={settingsStyles.cardTitle}>
            <Trans key={'setting.about.version'} />
          </div>
          <div class={settingsStyles.cardCaption}>{packageJson.version}</div>
        </div>
      </Card>
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.about.developer'} />
      </div>
      <LinkCard
        alt="Khinenw"
        avatar
        image="https://avatars.githubusercontent.com/u/3919433?s=64&v=4"
        subtitle={
          <>
            <Trans key={'setting.about.alspotify-developer'} />,{' '}
            <Trans key={'setting.about.lyrs-developer'} />
          </>
        }
        title="Khinenw"
        url="https://github.com/HelloWorld017"
      />
      <LinkCard
        alt="Su-Yong"
        avatar
        image="https://avatars.githubusercontent.com/u/13764936?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-developer'} />}
        title="Su-Yong"
        url="https://github.com/Su-Yong"
      />
      <LinkCard
        alt="JellyBrick"
        avatar
        image="https://avatars.githubusercontent.com/u/16558115?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-developer'} />}
        title="JellyBrick"
        url="https://github.com/JellyBrick"
      />
      <LinkCard
        alt="SeongMin Park"
        avatar
        image="https://avatars.githubusercontent.com/u/13712304?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-developer'} />}
        title="SeongMin Park"
        url="https://github.com/smnis"
      />
      <LinkCard
        alt="alvin0319"
        avatar
        image="https://avatars.githubusercontent.com/u/32565818?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-contributor'} />}
        title="alvin0319"
        url="https://github.com/alvin0319"
      />
      <LinkCard
        alt="STGR"
        avatar
        image="https://avatars.githubusercontent.com/u/6727533?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-contributor'} />}
        title="STGR"
        url="https://github.com/SemteulGaram"
      />
      <div class={settingsStyles.sectionTitle}>
        <Trans key={'setting.about.translator'} />
      </div>
      <LinkCard
        alt="Hyeseo Lee"
        avatar
        image="https://avatars.githubusercontent.com/u/6704921?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.german'} />}
        title="Hyeseo Lee"
        url="https://github.com/Flaplim"
      />
      <LinkCard
        alt="mocha"
        avatar
        image="https://avatars.githubusercontent.com/u/30190259?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.japanese'} />}
        title="mocha"
        url="https://github.com/hwangseonu"
      />
      <LinkCard
        alt="ReturnToFirst"
        avatar
        image="https://avatars.githubusercontent.com/u/19341560?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.english'} />}
        title="ReturnToFirst"
        url="https://github.com/ReturnToFirst"
      />
      <LinkCard
        alt="Seungho Baik"
        avatar
        image="https://avatars.githubusercontent.com/u/16580092?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.english'} />}
        title="Seungho Baik"
        url="https://github.com/sbaik2"
      />
      <LinkCard
        alt="Aden1126"
        avatar
        image="https://avatars.githubusercontent.com/u/129780719?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.english'} />}
        title="Aden1126"
        url="https://github.com/Aden1126"
      />
    </div>
  );
};

export default InfoContainer;
