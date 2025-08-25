import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTimer } from '../hooks/useTimer';
import { useExercises } from '../hooks/useExercises';
import { TimerDisplay } from '../components/TimerDisplay';
import { ExerciseSession } from '../components/ExerciseSession';
import { Settings, BreakSession, ExerciseCategory } from '../types';
import { exerciseCategories } from '../data/exercises';
import { Play, Pause, Square, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const defaultSettings: Settings = {
  interval: 30,
  selectedCategory: 'All',
  soundEnabled: true,
  soundVolume: 0.5,
  autoStart: false,
  cooldownExercises: 5,
  notificationsEnabled: true
};

export default function HomePage() {
  const [settings] = useLocalStorage<Settings>('office-drills-settings', defaultSettings);
  const [sessions, setSessions] = useLocalStorage<BreakSession[]>('office-drills-sessions', []);
  const [showExerciseSession, setShowExerciseSession] = useState(false);
  const [sessionExercises, setSessionExercises] = useState<any[]>([]);
  
  const timer = useTimer(settings.interval * 60);
  const { selectExercisesForBreak, updateRecentExercises } = useExercises();
  const { toast } = useToast();

  const startBreakNow = () => {
    const exercises = selectExercisesForBreak(settings.selectedCategory, settings);
    if (exercises.length === 0) {
      toast({
        title: 'No exercises available',
        description: 'Please add some exercises or change your category selection.',
        variant: 'destructive'
      });
      return;
    }
    
    setSessionExercises(exercises);
    setShowExerciseSession(true);
  };

  const handleSessionComplete = (session: BreakSession) => {
    setSessions(prev => [session, ...prev]);
    updateRecentExercises(session.exercises.filter(e => e.completed).map(e => e.exerciseId));
    setShowExerciseSession(false);
    
    // Reset timer for next break
    timer.reset(settings.interval * 60);
    if (settings.autoStart) {
      timer.start();
    }

    toast({
      title: 'Break completed!',
      description: `Completed ${session.exercises.filter(e => e.completed).length} exercises.`,
    });
  };

  const handleSessionClose = () => {
    setShowExerciseSession(false);
  };

  // Auto-start timer if enabled
  React.useEffect(() => {
    if (settings.autoStart && !timer.isRunning && !timer.isPaused) {
      timer.start();
    }
  }, [settings.autoStart]);

  // Check for break time
  React.useEffect(() => {
    if (timer.timeRemaining === 0 && timer.isRunning) {
      if (settings.notificationsEnabled && 'Notification' in window) {
        new Notification('Time for a break!', {
          body: 'Your micro-break is ready. Click to start exercises.',
          icon: '/favicon.ico'
        });
      }
      
      if (settings.soundEnabled) {
        // Would play break sound here
        console.log('🔊 Break time sound');
      }
      
      startBreakNow();
    }
  }, [timer.timeRemaining, timer.isRunning]);

  const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const thisWeekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Office Drills</h1>
          <p className="text-muted-foreground">Stay healthy with regular micro-breaks</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Category: {settings.selectedCategory}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <TimerDisplay timer={timer} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timer Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {!timer.isRunning ? (
                  <Button onClick={timer.start} className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                ) : timer.isPaused ? (
                  <Button onClick={timer.resume} className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button onClick={timer.pause} variant="outline" className="flex-1">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button onClick={timer.stop} variant="outline">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
                
                <Button onClick={() => timer.reset(settings.interval * 60)} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              <Button onClick={startBreakNow} variant="default" className="w-full">
                Start Break Now
              </Button>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => timer.snooze(10)}
                  disabled={!timer.isRunning}
                >
                  Snooze 10m
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => timer.snooze(20)}
                  disabled={!timer.isRunning}
                >
                  Snooze 20m
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => timer.snooze(30)}
                  disabled={!timer.isRunning}
                >
                  Snooze 30m
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{todaySessions.length}</div>
                  <div className="text-sm text-muted-foreground">Breaks Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {todaySessions.reduce((sum, s) => sum + s.exercises.filter(e => e.completed).length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Exercises Done</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{thisWeekSessions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Breaks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(thisWeekSessions.reduce((sum, s) => sum + s.totalDuration, 0) / 60)}
                  </div>
                  <div className="text-sm text-muted-foreground">Minutes Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {sessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="text-sm">
                        <div className="font-medium">{new Date(session.timestamp).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          {session.exercises.filter(e => e.completed).length} exercises completed
                        </div>
                      </div>
                      <Badge variant="outline">{session.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showExerciseSession && (
        <ExerciseSession
          exercises={sessionExercises}
          onComplete={handleSessionComplete}
          onClose={handleSessionClose}
        />
      )}
    </div>
  );
}