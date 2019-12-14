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
  openModal: (component: any, label?: string, options?: Options) => string;
  closeModal: (id: string) => void;
  expand: (id: string, expand: boolean) => void;
}

export interface ModalState {
  component: Component;
  label: string;
  options: Options;
  expanded: boolean;
  id: string;
}
