import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BreakSession } from '../types';
import { Calendar, Clock, TrendingUp, Download } from 'lucide-react';

export default function HistoryPage() {
  const [sessions] = useLocalStorage<BreakSession[]>('office-drills-sessions', []);

  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const todaySessions = sessions.filter(s => s.date === today);
  const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo);
  const monthSessions = sessions.filter(s => new Date(s.date) >= monthAgo);

  const calculateStats = (sessionList: BreakSession[]) => {
    const totalSessions = sessionList.length;
    const totalExercises = sessionList.reduce((sum, s) => sum + s.exercises.length, 0);
    const completedExercises = sessionList.reduce((sum, s) => sum + s.exercises.filter(e => e.completed).length, 0);
    const totalDuration = sessionList.reduce((sum, s) => sum + s.totalDuration, 0);
    const completionRate = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

    return {
      totalSessions,
      totalExercises,
      completedExercises,
      totalDuration: Math.round(totalDuration / 60), // Convert to minutes
      completionRate: Math.round(completionRate)
    };
  };

  const exportHistoryCSV = () => {
    const csvHeader = 'Date,Time,Category,Exercise,Status,Duration\n';
    const csvData = sessions.flatMap(session =>
      session.exercises.map(exercise => [
        session.date,
        new Date(session.timestamp).toLocaleTimeString(),
        session.category,
        exercise.exerciseName,
        exercise.completed ? 'Completed' : exercise.skipped ? 'Skipped' : 'Incomplete',
        '30' // Exercise duration
      ].join(','))
    ).join('\n');

    const csvContent = csvHeader + csvData;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `office-drills-history-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exercise History</h1>
          <p className="text-muted-foreground">Track your progress and maintain your streak</p>
        </div>
        <Button onClick={exportHistoryCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <StatsCards stats={calculateStats(todaySessions)} />
          <SessionsList sessions={todaySessions} title="Today's Sessions" />
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <StatsCards stats={calculateStats(weekSessions)} />
          <SessionsList sessions={weekSessions} title="This Week's Sessions" />
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <StatsCards stats={calculateStats(monthSessions)} />
          <SessionsList sessions={monthSessions} title="This Month's Sessions" />
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <StatsCards stats={calculateStats(sessions)} />
          <SessionsList sessions={sessions} title="All Sessions" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatsCardsProps {
  stats: {
    totalSessions: number;
    totalExercises: number;
    completedExercises: number;
    totalDuration: number;
    completionRate: number;
  };
}

function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Exercises Done</p>
              <p className="text-2xl font-bold">{stats.completedExercises}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Minutes</p>
              <p className="text-2xl font-bold">{stats.totalDuration}</p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{stats.completionRate}%</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-primary"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SessionsListProps {
  sessions: BreakSession[];
  title: string;
}

function SessionsList({ sessions, title }: SessionsListProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No sessions recorded for this period
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({sessions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{session.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(session.timestamp).toLocaleDateString()} at{' '}
                    {new Date(session.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(session.totalDuration / 60)}m
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {session.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-sm ${
                      exercise.completed
                        ? 'bg-success/10 text-success-foreground border border-success/20'
                        : exercise.skipped
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-destructive/10 text-destructive-foreground border border-destructive/20'
                    }`}
                  >
                    <div className="font-medium">{exercise.exerciseName}</div>
                    <div className="text-xs">
                      {exercise.completed ? 'Completed' : exercise.skipped ? 'Skipped' : 'Incomplete'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}