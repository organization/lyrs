import { useTransContext } from '@jellybrick/solid-i18next';
import { Input } from '@suis-ui/kit';

import Modal from '../../../../components/Modal';
import { ModalBody, ModalTitle } from '../../../components/setting-layout';

export interface ViewRenameModalProps {
  conflictOpen: boolean;
  name: string;
  target: string | null;
  onClose: () => void;
  onCloseConflict: () => void;
  onConfirm: () => void;
  onNameChange: (name: string) => void;
}

const ViewRenameModal = (props: ViewRenameModalProps) => {
  const [t] = useTransContext();

  return (
    <>
      <Modal
        buttons={[
          {
            name: t('common.close'),
            onClick: props.onClose,
          },
          {
            type: 'positive',
            name: t('common.okay'),
            onClick: props.onConfirm,
          },
        ]}
        onClose={props.onClose}
        open={props.target !== null}
      >
        <ModalTitle>{t('setting.view.rename-alert-title')}</ModalTitle>
        <ModalBody>
          {t('setting.view.rename-alert', { name: props.target })}
        </ModalBody>
        <Input
          onChange={(event) => props.onNameChange(event.target.value)}
          value={props.name}
          w="100%"
        />
      </Modal>
      <Modal
        buttons={[
          {
            name: t('common.okay'),
            onClick: props.onCloseConflict,
          },
        ]}
        onClose={props.onCloseConflict}
        open={props.conflictOpen}
      >
        <ModalTitle>{t('setting.view.rename-conflict-title')}</ModalTitle>
        <ModalBody>
          {t('setting.view.rename-conflict', { name: props.name })}
        </ModalBody>
      </Modal>
    </>
  );
};

export default ViewRenameModal;
