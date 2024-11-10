export interface IModal {
  onHide: () => void;
  className?: string;
  children: React.ReactNode;
  dialog?: {
    isOpen: boolean;
    onHide: () => void;
    children: React.ReactNode;
    className?: string;
  };
}
