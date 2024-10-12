import { EnumModalDialogOptionType } from '../../../../hooks/useModalDialog';

import styles from './styles.module.scss';

export const dirtyFormWarningDialog = {
  title: 'Exit Confirmation',
  description: 'You have unsaved changes. If you exit, they will be lost. Are you sure you want to exit?',
  options: [
    {
      type: EnumModalDialogOptionType.OTHER,
      title: 'Yes',
      callback: () => {},
      className: styles.exit,
    },
    {
      type: EnumModalDialogOptionType.RETURN,
      title: 'Return',
      callback: () => {},
      className: styles.return,
    },
  ],
};

export default dirtyFormWarningDialog;
