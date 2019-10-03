import React, { createContext, useContext, useState, useCallback, useMemo, Fragment, FC } from 'react';
import Modal from '@material-ui/core/Modal';
import Close from '@material-ui/icons/Close';
import { withStyles, CSSProperties } from '@material-ui/styles';
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
  dynamicState?: any;
  classes: any;
}

const ModalContext = createContext<ModalContextValue>(null);

const INITIAL_STATE: ModalState[] = [{ component: null, label: 'Modal', options: {}, expanded: false }];

export const ModalProviderWithoutStyles: FC<ModalProps> = ({ classes, children, dynamicState = {} }) => {
  const [modals, setModals] = useState<ModalState[]>(INITIAL_STATE);
  const modal = useMemo(() => modals[modals.length - 1], [modals]);
  const handleClose = useCallback(() => {
    setModals(prev => {
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
  const contextValue = useMemo(() => ({ openModal: handleOpen, closeModal: handleClose, expand: handleExpand, dynamicState }), [dynamicState]);
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

export const useModalDynamicState = (): any => {
  const { dynamicState } = useContext(ModalContext);

  return dynamicState;
}

export default useModal;
