import React, { createContext, useContext, useState, useCallback, useMemo, Fragment, FC, useRef } from 'react';
import Modal from '@material-ui/core/Modal';
import Close from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import uuidv4 from 'uuid/v4';
import {
  OpenModal,
  CloseModal,
  ExpandModal,
  ModalContextValue,
  ModalState,
} from './types';
import { styles } from './styles';

interface ModalProps {
  children: any;
  classes: any;
}

const ModalContext = createContext<ModalContextValue>(null);
const DEFAULT_MODAL: ModalState = { component: null, label: 'Modal', options: {}, expanded: false, id: null };

const INITIAL_STATE: ModalState[] = [DEFAULT_MODAL];

export const ModalProviderWithoutStyles: FC<ModalProps> = ({ classes, children }) => {
  const [modals, setModals] = useState<ModalState[]>(INITIAL_STATE);
  const modal = useMemo(() => modals[modals.length - 1] || DEFAULT_MODAL, [modals]);

  const handleClose = useCallback((uuid: string) => {
    setModals(prev => {
      if (prev.length === 0) return prev;
      return prev.filter(prevModal => {
        if (prevModal.id === uuid) {
          prevModal.options?.afterClose?.();
          return false;
        }
        return true;
      });
    });
  },[]);
  const handleOpen = useCallback((component, label = 'Modal', options = {}) => {
    const uuid = uuidv4();
    setModals(prev => prev.concat({ component, label, options, expanded: false, id: uuid }));
    return uuid;
  },[]);
  const handleExpand = useCallback((id: string, expand: boolean) => {
    setModals(prev => prev.map(prevModal => prevModal.id === id ? {
      ...prevModal,
      expanded: expand,
    } : prevModal))
  }, []);
  const contextValue = useMemo(() => ({ openModal: handleOpen, closeModal: handleClose, expand: handleExpand }), []);
  const modalStyle = {    
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
          <div className={classNames(classes.root, modal.options.className)} style={modalStyle}>
            <button className={classes.closeButton} onClick={() => handleClose(modal.id)}><Close/></button>
            {modal.component}
          </div>
        </Modal>
      </Fragment>
    </ModalContext.Provider>
  );
};

export const ModalProvider = withStyles(styles)(ModalProviderWithoutStyles);

export const useModal = (): [OpenModal, CloseModal, ExpandModal] => {
  const modalId = useRef<string>(null);
  const { openModal, closeModal, expand } = useContext(ModalContext);
  const handleOpen: OpenModal = (...args) => {
    modalId.current = openModal(...args);
  };
  const handleClose: CloseModal = () => {
    closeModal(modalId.current);
  };
  const handleExpand: ExpandModal = (shouldExpand: boolean) => {
    expand(modalId.current, shouldExpand); 
  };

  return [handleOpen, handleClose, handleExpand];
};

export default useModal;
