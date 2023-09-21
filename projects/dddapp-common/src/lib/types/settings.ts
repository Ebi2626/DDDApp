export interface Settings {
  userId?: string;
  colors: Color[];
  notificationTime: NotificationTime;
}

export interface NotificationTime {
  hour: number;
  minute: number;
}

export interface Color {
  color: string;
  label: string;
  colorId: string;
  defaultValue: string;
}

export enum COLOR_VARIABLES {
  PRIMARY = 'primary',
  PRIMARY_60 = 'primary-60',
  SECONDARY = 'secondary',
  BG_COLOR = 'bg-color',
  TEXT_COLOR = 'text-color',
}

export enum COLOR_LABEL {
  PRIMARY = 'Kolor główny: ',
  PRIMARY_60 = 'Kolor główny wytłumiony: ',
  SECONDARY = 'Kolor wyróżniony: ',
  BG_COLOR = 'Kolor tła: ',
  TEXT_COLOR = 'Kolor tekstu: ',
}

export enum DEFAULT_COLORS {
  PRIMARY = '#19647e',
  PRIMARY_60 = '#19657e66',
  SECONDARY = '#28afb0',
  BG_COLOR = '#1f1f28',
  TEXT_COLOR = '#ffffff',
}

export const DEFAULT_COLORS_ARRAY: Color[] = [
  {
    colorId: COLOR_VARIABLES.PRIMARY,
    defaultValue: DEFAULT_COLORS.PRIMARY,
    label: COLOR_LABEL.PRIMARY,
    color: DEFAULT_COLORS.PRIMARY,
  },
  {
    colorId: COLOR_VARIABLES.PRIMARY_60,
    defaultValue: DEFAULT_COLORS.PRIMARY_60,
    label: COLOR_LABEL.PRIMARY_60,
    color: DEFAULT_COLORS.PRIMARY_60,
  },
  {
    colorId: COLOR_VARIABLES.SECONDARY,
    defaultValue: DEFAULT_COLORS.SECONDARY,
    label: COLOR_LABEL.SECONDARY,
    color: DEFAULT_COLORS.SECONDARY,
  },
  {
    colorId: COLOR_VARIABLES.BG_COLOR,
    defaultValue: DEFAULT_COLORS.BG_COLOR,
    label: COLOR_LABEL.BG_COLOR,
    color: DEFAULT_COLORS.BG_COLOR,
  },
  {
    colorId: COLOR_VARIABLES.TEXT_COLOR,
    defaultValue: DEFAULT_COLORS.TEXT_COLOR,
    label: COLOR_LABEL.TEXT_COLOR,
    color: DEFAULT_COLORS.TEXT_COLOR,
  },
];

export const DEFAULT_USER_SETTINGS: Settings = {
  colors: DEFAULT_COLORS_ARRAY,
  notificationTime: {
    hour: 12,
    minute: 0,
  },
};
