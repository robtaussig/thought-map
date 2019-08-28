import React, { createContext, useContext, useState, useCallback, useMemo, Fragment, Component, FC } from 'react';
import Modal from '@material-ui/core/Modal';
import Close from '@material-ui/icons/Close';
import { CSSProperties } from '@material-ui/styles';

interface Options {
  style?: CSSProperties
}

type OpenModal = (component: any, label?: string, options?: Options) => void;
type CloseModal = () => void;

interface ModalContextValue {
  openModal: OpenModal,
  closeModal: CloseModal,
  dynamicState?: any,
}

interface ModalState {
  component: Component,
  label: string,
  options: Options,
}

interface ModalProps {
  children: any,
  dynamicState?: any,
}

const ModalContext = createContext<ModalContextValue>(null);

const INITIAL_STATE: ModalState = { component: null, label: 'Modal', options: {} };
const MODAL_WRAPPER_STYLE: CSSProperties = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '80%',
  overflow: 'auto',
  left: '10%',
  right: '10%',
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
  const [modal, setModal] = useState<ModalState>(INITIAL_STATE);

  const handleClose = useCallback(() => setModal(INITIAL_STATE),[]);
  const handleOpen = useCallback((component, label = 'Modal', options = {}) => {
    setModal({ component, label, options });
  },[]);
  const contextValue = useMemo(() => ({ openModal: handleOpen, closeModal: handleClose, dynamicState }), [dynamicState]);

  return (
    <ModalContext.Provider value={contextValue}>
      <Fragment>
        {children}
        <Modal
          aria-labelledby={modal.label}
          open={modal.component !== null}
          onClose={handleClose}
        >
          <div style={{ ...MODAL_WRAPPER_STYLE, ...(modal.options.style || {})}}>
            <button onClick={handleClose} style={CLOSE_BUTTON_STYLE}><Close/></button>
            {modal.component}
          </div>
        </Modal>
      </Fragment>
    </ModalContext.Provider>
  );
};

export const useModal = (): [OpenModal, CloseModal] => {
  const { openModal, closeModal } = useContext(ModalContext);

  return [openModal, closeModal];
};

export const useModalDynamicState = (): any => {
  const { dynamicState } = useContext(ModalContext);

  return dynamicState;
}

export default useModal;
