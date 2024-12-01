import { EnumModalDialogOptionType } from '../../../../hooks/useModalDialog';

import btnStyles from '../../../../styles/components/buttons/solidLightButtons.module.scss';

export const dirtyFormWarningDialog = {
  title: 'Exit Confirmation',
  description: 'You have unsaved changes. If you exit, they will be lost. Are you sure you want to exit?',
  options: [
    {
      type: EnumModalDialogOptionType.OTHER,
      title: 'Yes',
      callback: () => {},
      className: btnStyles.redLight,
    },
    {
      type: EnumModalDialogOptionType.RETURN,
      title: 'Return',
      callback: () => {},
      className: btnStyles.greenSolid,
    },
  ],
};

export default dirtyFormWarningDialog;
