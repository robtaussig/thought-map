import React, { createContext, useContext, useState, useCallback, useMemo, Fragment, FC, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import Close from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
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
const DEFAULT_MODAL: ModalState = { component: null, label: 'Modal', options: {}, expanded: false };

const INITIAL_STATE: ModalState[] = [DEFAULT_MODAL];

export const ModalProviderWithoutStyles: FC<ModalProps> = ({ classes, children }) => {
  const [modals, setModals] = useState<ModalState[]>(INITIAL_STATE);
  const modal = useMemo(() => modals[modals.length - 1] || DEFAULT_MODAL, [modals]);

  const handleClose = useCallback(() => {
    setModals(prev => {
      if (prev.length === 0) return prev;

      if (prev[prev.length - 1].options && prev[prev.length - 1].options.afterClose) {
        prev[prev.length - 1].options.afterClose();
      }
      return prev.slice(0, prev.length - 1);
    });
  },[]);
  const handleOpen = useCallback((component, label = 'Modal', options = {}) => {
    setModals(prev => prev.concat({ component, label, options, expanded: false }));
  },[]);
  const handleExpand = useCallback((expand: boolean) => {
    setModals(prev => prev.map((modal, idx) => idx === prev.length - 1 ? {
      ...modal,
      expanded: expand,
    } : modal))
  }, []);
  const contextValue = useMemo(() => ({ openModal: handleOpen, closeModal: handleClose, expand: handleExpand }), []);
  const modalStyle = {    
    left: modal.expanded ? 0 : '10%',
    right: modal.expanded ? 0 : '10%',
    height: modal.expanded ? '100%' : undefined,
    maxHeight: modal.expanded ? '100%' : '80%',
    ...(modal.options.style || {})
  };

  useEffect(() => {
    window.addEventListener('popstate', handleClose);

    return () => window.removeEventListener('popstate', handleClose);
  }, []);

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
            <button className={classes.closeButton} onClick={handleClose}><Close/></button>
            {modal.component}
          </div>
        </Modal>
      </Fragment>
    </ModalContext.Provider>
  );
};

export const ModalProvider = withStyles(styles)(ModalProviderWithoutStyles);

export const useModal = (): [OpenModal, CloseModal, ExpandModal] => {
  const { openModal, closeModal, expand } = useContext(ModalContext);

  return [openModal, closeModal, expand];
};

export default useModal;
