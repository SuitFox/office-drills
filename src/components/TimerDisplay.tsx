import React from 'react';
import { TimerState } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimerDisplayProps {
  timer: TimerState;
}

export function TimerDisplay({ timer }: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (!timer.isRunning) return 'secondary';
    if (timer.isPaused) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (!timer.isRunning) return 'Stopped';
    if (timer.isPaused) return 'Paused';
    return 'Running';
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <Badge variant={getStatusColor() as any} className="mb-2">
              {getStatusText()}
            </Badge>
            <div className="text-4xl font-mono font-bold">
              {formatTime(timer.timeRemaining)}
            </div>
            <p className="text-sm text-muted-foreground">
              Until next break
            </p>
          </div>
          
          {timer.nextBreakTime && (
            <div className="text-sm text-muted-foreground">
              Next break at: {new Date(timer.nextBreakTime).toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}