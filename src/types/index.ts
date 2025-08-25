export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: ExerciseCategory;
  instructions: string[];
}

export type ExerciseCategory = 
  | 'Neck' 
  | 'Shoulders' 
  | 'Back' 
  | 'Hips' 
  | 'Legs' 
  | 'Feet' 
  | 'Hands' 
  | 'Full-Body' 
  | 'Stretch' 
  | 'Strength';

export interface Settings {
  interval: number; // minutes
  selectedCategory: ExerciseCategory | 'All';
  soundEnabled: boolean;
  soundVolume: number;
  autoStart: boolean;
  cooldownExercises: number;
  notificationsEnabled: boolean;
}

export interface BreakSession {
  id: string;
  date: string;
  timestamp: number;
  category: ExerciseCategory | 'All';
  exercises: {
    exerciseId: string;
    exerciseName: string;
    completed: boolean;
    skipped: boolean;
  }[];
  totalDuration: number;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number; // seconds
  nextBreakTime: number | null;
}