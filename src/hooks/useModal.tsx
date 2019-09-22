import React, { createContext, useContext, useState, useCallback, useMemo, Fragment, Component, FC } from 'react';
import Modal from '@material-ui/core/Modal';
import Close from '@material-ui/icons/Close';
import { CSSProperties } from '@material-ui/styles';

interface Options {
  style?: CSSProperties;
  className?: string;
}

export type OpenModal = (component: any, label?: string, options?: Options) => void;
export type CloseModal = () => void;
export type ExpandModal = (expand: boolean) => void;

interface ModalContextValue {
  openModal: OpenModal;
  closeModal: CloseModal;
  expand: ExpandModal;
  dynamicState?: any;
}

interface ModalState {
  component: Component;
  label: string;
  options: Options;
  expanded: boolean;
}

interface ModalProps {
  children: any;
  dynamicState?: any;
}

const ModalContext = createContext<ModalContextValue>(null);

const INITIAL_STATE: ModalState[] = [{ component: null, label: 'Modal', options: {}, expanded: false }];
const MODAL_WRAPPER_STYLE: CSSProperties = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '#539aff',
  padding: 30,
};

const CLOSE_BUTTON_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  margin: 5,
  color: 'white',
};

export const ModalProvider: FC<ModalProps> = ({ children, dynamicState = {} }) => {
  const [modals, setModals] = useState<ModalState[]>(INITIAL_STATE);
  const modal = useMemo(() => modals[modals.length - 1], [modals]);
  const handleClose = useCallback(() => setModals(prev => prev.slice(0, prev.length - 1)),[]);
  const handleOpen = useCallback((component, label = 'Modal', options = {}) => {
    setModals(prev => prev.concat({ component, label, options, expanded: false }));
  },[]);
  const handleExpand = useCallback((expand: boolean) => {
    setModals(prev => prev.map((modal, idx) => idx === prev.length - 1 ? {
      ...modal,
      expanded: expand,
    } : modal))
  }, []);
  const contextValue = useMemo(() => ({ openModal: handleOpen, closeModal: handleClose, expand: handleExpand, dynamicState }), [dynamicState]);
  const modalStyle = {
    ...MODAL_WRAPPER_STYLE,
    left: modal.expanded ? 0 : '10%',
    right: modal.expanded ? 0 : '10%',
    height: modal.expanded ? '100%' : undefined,
    maxHeight: modal.expanded ? '100%' : '80%',
    ...(modal.options.style || {})
  };

  return (
    <ModalContext.Provider value={contextValue}>
      <Fragment>
        {children}
        <Modal
          aria-labelledby={modal.label}
          open={modal.component !== null}
          onClose={handleClose}
        >
          <div className={modal.options.className} style={modalStyle}>
            <button onClick={handleClose} style={CLOSE_BUTTON_STYLE}><Close/></button>
            {modal.component}
          </div>
        </Modal>
      </Fragment>
    </ModalContext.Provider>
  );
};

export const useModal = (): [OpenModal, CloseModal, ExpandModal] => {
  const { openModal, closeModal, expand } = useContext(ModalContext);

  return [openModal, closeModal, expand];
};

export const useModalDynamicState = (): any => {
  const { dynamicState } = useContext(ModalContext);

  return dynamicState;
}

export default useModal;
