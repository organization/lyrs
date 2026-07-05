import { useTransContext } from '@jellybrick/solid-i18next';
import { For } from 'solid-js';

import * as styles from './game-view-modal.css';

import Card from '../../../../components/Card';
import Modal from '../../../../components/Modal';
import {
  CardTitle,
  CheckPlaceholder,
  ModalTitle,
  Spacer,
} from '../../../components/setting-layout';

import type { Config } from '../../../../../common/schema';

export interface GameViewModalProps {
  open: boolean;
  views?: Config['views'];
  onClose: () => void;
  onSelectView: (viewName: string) => void;
}

const GameViewModal = (props: GameViewModalProps) => {
  const [t] = useTransContext();

  return (
    <Modal class={styles.modalNarrow} onClose={props.onClose} open={props.open}>
      <ModalTitle>
        {t('setting.game.select-view-to-show-game-overlay')}
      </ModalTitle>
      <For each={props.views}>
        {(view) => (
          <Card onClick={() => props.onSelectView(view.name)}>
            <CheckPlaceholder />
            <CardTitle>{view.name}</CardTitle>
            <Spacer />
          </Card>
        )}
      </For>
    </Modal>
  );
};

export default GameViewModal;
