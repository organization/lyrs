import { Trans } from '@jellybrick/solid-i18next';
import { Button } from '@suis-ui/kit';
import { CloudDownload, ExternalLink, Info } from 'lucide-solid';
import { createSignal, Match, Switch } from 'solid-js';

import AboutLinkCard from './components/about-link-card';

import ErrorIcon from '../../../../assets/icon_error.png';
import MainIcon from '../../../../assets/icon_music.png';
import packageJson from '../../../../package.json';
import Card from '../../../components/Card';
import Spinner from '../../../components/Spinner';
import {
  CardCaption,
  CardColumn,
  CardRow,
  CardTitle,
  iconMediumProps,
  iconSmallProps,
  PageRoot,
  PageTitle,
  SectionTitle,
  Spacer,
} from '../../components/setting-layout';

import type { UpdateCheckResult } from 'electron-updater';

const ExternalIcon = () => <ExternalLink {...iconSmallProps} />;

export const AboutPage = () => {
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
    <PageRoot>
      <PageTitle>
        <Trans key={'setting.title.about'} />
      </PageTitle>
      <SectionTitle>
        <Trans key={'setting.about.support'} />
      </SectionTitle>
      <AboutLinkCard
        alt="Lyrs"
        image={MainIcon}
        subtitle="https://github.com/organization/lyrs"
        title="Lyrs"
        url="https://github.com/organization/lyrs"
      />
      <AboutLinkCard
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
          <CardRow>
            <CloudDownload {...iconMediumProps} />
            <CardColumn>
              <Switch
                fallback={
                  <CardRow>
                    <Spinner size="1rem" />
                    <Trans key={'setting.about.checking-for-updates'} />
                  </CardRow>
                }
              >
                <Match when={(updateData()?.compareResult ?? 0) < 0}>
                  <CardTitle>
                    <Trans key={'setting.about.update-available'} />
                  </CardTitle>
                  <CardCaption>
                    <Trans
                      key={'setting.about.latest-version'}
                      options={{
                        version:
                          updateData()?.updateCheckResult?.updateInfo.version,
                      }}
                    />
                  </CardCaption>
                </Match>
                <Match when={(updateData()?.compareResult ?? 0) >= 0}>
                  <CardTitle>
                    <Trans key={'setting.about.already-up-to-date'} />
                  </CardTitle>
                  <CardCaption>
                    <Trans
                      key={'setting.about.current-version'}
                      options={{ version: updateData()?.currentVersion }}
                    />
                  </CardCaption>
                </Match>
              </Switch>
            </CardColumn>
            <Spacer />
            <Button onClick={() => refreshUpdateData()} variant="primary">
              <Trans key={'setting.about.refresh'} />
            </Button>
          </CardRow>,
          <CardRow
            onClick={() =>
              onLink('https://github.com/organization/lyrs/releases')
            }
          >
            <Trans key={'setting.about.visit-releases-page'} />
            <Spacer />
            <ExternalIcon />
          </CardRow>,
        ]}
      >
        <Info {...iconMediumProps} />
        <CardColumn>
          <CardTitle>
            <Trans key={'setting.about.version'} />
          </CardTitle>
          <CardCaption>{packageJson.version}</CardCaption>
        </CardColumn>
      </Card>
      <SectionTitle>
        <Trans key={'setting.about.developer'} />
      </SectionTitle>
      <AboutLinkCard
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
      <AboutLinkCard
        alt="Su-Yong"
        avatar
        image="https://avatars.githubusercontent.com/u/13764936?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-developer'} />}
        title="Su-Yong"
        url="https://github.com/Su-Yong"
      />
      <AboutLinkCard
        alt="JellyBrick"
        avatar
        image="https://avatars.githubusercontent.com/u/16558115?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-developer'} />}
        title="JellyBrick"
        url="https://github.com/JellyBrick"
      />
      <AboutLinkCard
        alt="SeongMin Park"
        avatar
        image="https://avatars.githubusercontent.com/u/13712304?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-developer'} />}
        title="SeongMin Park"
        url="https://github.com/smnis"
      />
      <AboutLinkCard
        alt="alvin0319"
        avatar
        image="https://avatars.githubusercontent.com/u/32565818?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-contributor'} />}
        title="alvin0319"
        url="https://github.com/alvin0319"
      />
      <AboutLinkCard
        alt="STGR"
        avatar
        image="https://avatars.githubusercontent.com/u/6727533?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-contributor'} />}
        title="STGR"
        url="https://github.com/SemteulGaram"
      />
      <SectionTitle>
        <Trans key={'setting.about.translator'} />
      </SectionTitle>
      <AboutLinkCard
        alt="Hyeseo Lee"
        avatar
        image="https://avatars.githubusercontent.com/u/6704921?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.german'} />}
        title="Hyeseo Lee"
        url="https://github.com/Flaplim"
      />
      <AboutLinkCard
        alt="mocha"
        avatar
        image="https://avatars.githubusercontent.com/u/30190259?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.japanese'} />}
        title="mocha"
        url="https://github.com/hwangseonu"
      />
      <AboutLinkCard
        alt="ReturnToFirst"
        avatar
        image="https://avatars.githubusercontent.com/u/19341560?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.english'} />}
        title="ReturnToFirst"
        url="https://github.com/ReturnToFirst"
      />
      <AboutLinkCard
        alt="Seungho Baik"
        avatar
        image="https://avatars.githubusercontent.com/u/16580092?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.english'} />}
        title="Seungho Baik"
        url="https://github.com/sbaik2"
      />
      <AboutLinkCard
        alt="Aden1126"
        avatar
        image="https://avatars.githubusercontent.com/u/129780719?s=64&v=4"
        subtitle={<Trans key={'setting.about.lyrs-translator.english'} />}
        title="Aden1126"
        url="https://github.com/Aden1126"
      />
    </PageRoot>
  );
};
