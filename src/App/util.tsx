import React, { MutableRefObject } from 'react';
import { getVersion } from '../components/Settings/components/SetupBackup/api';
import UpdateAvailable from '../components/Merge/UpdateAvailable';
import { ModalContextValue } from '../hooks/useModal/types';
import { Backup } from '../store/rxdb/schemas/backup';

export const checkVersionAndOpenModalIfUpdate = async (
  backups: Backup[],
  modalRef: MutableRefObject<ModalContextValue>,
) => {
  const activeBackup = backups.find(({ isActive }) => Boolean(isActive));
  if (activeBackup) {
    const response = await getVersion(activeBackup.backupId);
    if (response?.version > activeBackup.version) {
      const modalId = modalRef.current.openModal(
        <UpdateAvailable
          activeBackup={activeBackup}
          latestVersion={response.version}
          onClose={() => modalRef.current.closeModal(modalId)}
        />, 'Update Available'
      );
    }
  }
};
