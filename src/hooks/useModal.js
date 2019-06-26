import React, { createContext, useContext, useState, useCallback, useMemo, Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import Close from '@material-ui/icons/Close';

const ModalContext = createContext();

const INITIAL_STATE = { component: null, label: 'Modal', options: {} };
const MODAL_WRAPPER_STYLE = {
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

const CLOSE_BUTTON_STYLE = {
  position: 'absolute',
  top: 0,
  right: 0,
  margin: 5,
  color: 'white',
};

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(INITIAL_STATE);

  const handleClose = useCallback(() => setModal(INITIAL_STATE),[]);
  const handleOpen = useCallback((component, label = 'Modal', options = {}) => {
    setModal({ component, label, options });
  },[]);
  const contextValue = useMemo(() => ({ openModal: handleOpen, closeModal: handleClose }), []);

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

export const useModal = () => {
  const { openModal, closeModal } = useContext(ModalContext);

  return [openModal, closeModal];
};

export default useModal;
