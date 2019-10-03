import { Component } from 'react';
import { CSSProperties } from '@material-ui/styles';

export interface Options {
  style?: CSSProperties;
  className?: string;
  afterClose?: () => void;
}

export type OpenModal = (component: any, label?: string, options?: Options) => void;
export type CloseModal = () => void;
export type ExpandModal = (expand: boolean) => void;

export interface ModalContextValue {
  openModal: OpenModal;
  closeModal: CloseModal;
  expand: ExpandModal;
  dynamicState?: any;
}

export interface ModalState {
  component: Component;
  label: string;
  options: Options;
  expanded: boolean;
}
