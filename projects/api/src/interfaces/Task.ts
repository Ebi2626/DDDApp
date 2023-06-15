export interface Time {} // TODO: uzupełnić z anuglara
export interface Period {} // TODO Uzupełnić z angulara

export enum TaskType {
  PERIODIC = 'PERIODIC',
  PROGRESSIVE = 'PROGRESSIVE',
  SINGLE = 'SINGLE',
}

export enum MeasurmentType {
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  FILE = 'FILE',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
}

export interface MeasurementTime {
  markRealizationTime: Time;
  period: Period; // ms
}

export interface Task {
  id: string;
  title: string;
  parentId: string;
  type: TaskType;
  measurement: MeasurmentType;
  creationTime: Date;
  remindTime: Time;

  // 1. Treść
  // 2. Cel nadrzędny (referencja do celu)
  // 3. Typ
  //   - cykliczne
  // - data początku
  // - interwał
  //   - jednorazowe
  // - data założonej realizacji
  // - progresywne
  //   - data początku
  //   - interwał
  // - sposób powiększania oraz częstotliwość powiększania
  // - jednostka
  // - licznik (bieżący stan)
  // 4. Sposób mierzenia
  //   - checkbox - lub wiele
  //   - plik
  //   - obraz
  //   - text
  //   - liczba
  //   - radio
  // 5. Czas rejestracji realizacji i częstotliwość
  // 6. Warunek końca (cel celu):
  // - czasowy(dla typu cyklicznego) lub osiągnięcie celu
  // - samo zadanie
  // - pułap lub osiągnięcie celu -> funkcjonalność transformacji w cel czasowy
  // 7. Nagroda ?
  // 8. Kara ?
}
