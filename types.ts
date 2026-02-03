
export enum HabitStatus {
  Empty,
  Completed,
  Incomplete,
}

export interface DayData {
  [habit: string]: HabitStatus;
}

export interface User {
  name: string;
  role: string;
  avatarSeed: string;
  avatarStyle: string;
  avatarImage?: string;
  habits: string[];
}

export interface UserData extends User {
  progress: {
    [date: string]: DayData;
  };
}

export interface FamilyData {
  [userName: string]: UserData;
}
