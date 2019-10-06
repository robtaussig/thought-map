export interface EditedMap {
  [id: string]: string;
}

export interface EditedObject {
  thoughtId: string;
  text: string;
}

export interface ChangeValue {
  value: any;
}

export interface ChangeType {
  target: ChangeValue;
}

export enum EditTypes {
  Text = 'Text',
  TextArea = 'TextArea',
  Select = 'Select',
  Checkbox = 'Checkbox',
  Date = 'Date',
  Time = 'Time',
  DateTime = 'DateTime',
  Button = 'Button',
  Photo = 'Photo',
  Number = 'Number',
}

export interface EditProps {
  type: EditTypes;
  options?: string[];
  onEdit?: (...args: any[]) => void;
  onCreate?: (value: string) => void;
  onDelete?: (...args: any[]) => void;
  onClickItem?: (...args: any[]) => void;
  disableQuickAction?: boolean;
}

export enum SectionState {
  NotEditingAnySection = -1,
  EditingOtherSection = 0,
  EditingSection = 1,
  EditingEverySection = 2,
}

export interface ComponentMap {
  [sectionType: string]: JSX.Element;
}

export interface SectionVisibility {
  [sectionType: string]: boolean;
}
