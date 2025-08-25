import { useState, useCallback } from 'react';
import { Exercise, ExerciseCategory, Settings } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { defaultExercises } from '../data/exercises';

export function useExercises() {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>('office-drills-exercises', defaultExercises);
  const [recentExercises, setRecentExercises] = useLocalStorage<string[]>('office-drills-recent', []);

  const selectExercisesForBreak = useCallback((
    category: ExerciseCategory | 'All', 
    settings: Settings
  ): Exercise[] => {
    const availableExercises = exercises.filter(exercise => {
      // Filter by category
      if (category !== 'All' && exercise.category !== category) {
        return false;
      }
      
      // Apply cooldown filter
      if (settings.cooldownExercises > 0 && 
          recentExercises.slice(0, settings.cooldownExercises).includes(exercise.id)) {
        return false;
      }
      
      return true;
    });

    if (availableExercises.length === 0) {
      // Fallback: return any exercises if none available
      return exercises.slice(0, 2);
    }

    if (category === 'All') {
      // Try to select from different categories
      const exercisesByCategory = new Map<ExerciseCategory, Exercise[]>();
      availableExercises.forEach(exercise => {
        if (!exercisesByCategory.has(exercise.category)) {
          exercisesByCategory.set(exercise.category, []);
        }
        exercisesByCategory.get(exercise.category)!.push(exercise);
      });

      const selected: Exercise[] = [];
      const categoriesUsed = new Set<ExerciseCategory>();

      // Try to pick from different categories
      while (selected.length < 2 && exercisesByCategory.size > 0) {
        for (const [category, categoryExercises] of exercisesByCategory.entries()) {
          if (selected.length >= 2) break;
          if (categoriesUsed.has(category) && exercisesByCategory.size > categoriesUsed.size) continue;
          
          const randomIndex = Math.floor(Math.random() * categoryExercises.length);
          const exercise = categoryExercises[randomIndex];
          
          if (!selected.includes(exercise)) {
            selected.push(exercise);
            categoriesUsed.add(category);
          }
        }
        
        // If we've tried all categories, allow repeats
        if (selected.length < 2 && categoriesUsed.size === exercisesByCategory.size) {
          break;
        }
      }

      // Fill remaining slots if needed
      while (selected.length < 2 && availableExercises.length > selected.length) {
        const remaining = availableExercises.filter(e => !selected.includes(e));
        if (remaining.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * remaining.length);
        selected.push(remaining[randomIndex]);
      }

      return selected;
    } else {
      // Single category selection
      const shuffled = [...availableExercises].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 2);
    }
  }, [exercises, recentExercises]);

  const updateRecentExercises = useCallback((exerciseIds: string[]) => {
    setRecentExercises(prev => {
      const updated = [...exerciseIds, ...prev];
      return updated.slice(0, 20); // Keep last 20 exercises
    });
  }, [setRecentExercises]);

  const addExercise = useCallback((exercise: Exercise) => {
    setExercises(prev => [...prev, exercise]);
  }, [setExercises]);

  const updateExercise = useCallback((updatedExercise: Exercise) => {
    setExercises(prev => 
      prev.map(exercise => 
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      )
    );
  }, [setExercises]);

  const deleteExercise = useCallback((exerciseId: string) => {
    setExercises(prev => prev.filter(exercise => exercise.id !== exerciseId));
  }, [setExercises]);

  const resetToDefaults = useCallback(() => {
    setExercises(defaultExercises);
    setRecentExercises([]);
  }, [setExercises, setRecentExercises]);

  return {
    exercises,
    selectExercisesForBreak,
    updateRecentExercises,
    addExercise,
    updateExercise,
    deleteExercise,
    resetToDefaults
  };
}