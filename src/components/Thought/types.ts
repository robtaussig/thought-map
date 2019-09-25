

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
}

export interface EditProps {
  type: EditTypes;
  options?: string[];
  onEdit: (...args: any[]) => void;
  onCreate?: (value: string) => void;
  onChangeVisibility: (visibility: boolean) => void;
}
