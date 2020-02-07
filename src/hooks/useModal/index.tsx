import React, { createContext, useContext, useState, useCallback, useMemo, Fragment, FC, useRef, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import Close from '@material-ui/icons/Close';
import classNames from 'classnames';
import uuidv4 from 'uuid/v4';
import {
  OpenModal,
  CloseModal,
  ExpandModal,
  ModalContextValue,
  ModalState,
} from './types';
import { useStyles } from './styles';

interface ModalProps {
  children: any;
  getContext?: (contextValue: ModalContextValue) => void;
}

const ModalContext = createContext<ModalContextValue>(null);
const DEFAULT_MODAL: ModalState = { component: null, label: 'Modal', options: {}, expanded: false, id: null };

const INITIAL_STATE: ModalState[] = [DEFAULT_MODAL];

export const ModalProvider: FC<ModalProps> = ({ children, getContext }) => {
  const classes = useStyles({});
  const [modals, setModals] = useState<ModalState[]>(INITIAL_STATE);
  const modal = useMemo(() => modals[modals.length - 1] || DEFAULT_MODAL, [modals]);

  const handleClose = useCallback((uuid: string) => {
    setModals(prev => {
      if (typeof uuid === 'string') {
        return prev.filter(prevModal => {
          if (prevModal.id === uuid) {
            const stopClose = prevModal.options?.afterClose?.();
            return Boolean(stopClose);
          }
          return true;
        });
      }
      return [];
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

  useEffect(() => {
    if (getContext) getContext(contextValue);
  }, [contextValue, getContext]);

  return (
    <ModalContext.Provider value={contextValue}>
      <Fragment>
        {children}
        <Modal
          aria-labelledby={modal.label}
          open={modal.component !== null}
          onClose={() => handleClose(modal.id)}
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
