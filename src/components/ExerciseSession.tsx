import React, { useState, useEffect } from 'react';
import { Exercise, BreakSession } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Check } from 'lucide-react';

interface ExerciseSessionProps {
  exercises: Exercise[];
  onComplete: (session: BreakSession) => void;
  onClose: () => void;
}

export function ExerciseSession({ exercises, onComplete, onClose }: ExerciseSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercises[0]?.duration || 30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionResults, setSessionResults] = useState<BreakSession['exercises']>([]);

  const currentExercise = exercises[currentExerciseIndex];
  const progress = currentExercise ? ((currentExercise.duration - timeRemaining) / currentExercise.duration) * 100 : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleExerciseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const handleExerciseComplete = () => {
    const result = {
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      completed: true,
      skipped: false
    };

    setSessionResults(prev => [...prev, result]);
    moveToNextExercise();
  };

  const handleSkipExercise = () => {
    const result = {
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      completed: false,
      skipped: true
    };

    setSessionResults(prev => [...prev, result]);
    moveToNextExercise();
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex + 1 < exercises.length) {
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeRemaining(exercises[currentExerciseIndex + 1].duration);
      setIsPlaying(false);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    const session: BreakSession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      category: 'All', // This would be passed from parent
      exercises: sessionResults,
      totalDuration: exercises.reduce((sum, ex) => sum + ex.duration, 0)
    };

    onComplete(session);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (!currentExercise) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </CardTitle>
          <p className="text-muted-foreground">{currentExercise.category}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">{currentExercise.name}</h2>
            <p className="text-lg text-muted-foreground mb-4">{currentExercise.description}</p>
            
            <div className="text-6xl font-mono font-bold text-primary mb-4">
              {formatTime(timeRemaining)}
            </div>
            
            <Progress value={progress} className="w-full h-3 mb-6" />
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1">
              {currentExercise.instructions.map((instruction, index) => (
                <li key={index} className="text-sm">{instruction}</li>
              ))}
            </ol>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSkipExercise}
              className="flex items-center gap-2"
            >
              <SkipForward className="h-4 w-4" />
              Skip
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={togglePlayPause}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Start'}
            </Button>
            
            <Button
              size="lg"
              onClick={handleExerciseComplete}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Done
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose}>
              Cancel Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}