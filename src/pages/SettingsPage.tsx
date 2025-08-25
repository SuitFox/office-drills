import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Settings, ExerciseCategory } from '../types';
import { exerciseCategories } from '../data/exercises';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Bell, Clock, RotateCcw, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const defaultSettings: Settings = {
  interval: 30,
  selectedCategory: 'All',
  soundEnabled: true,
  soundVolume: 0.5,
  autoStart: false,
  cooldownExercises: 5,
  notificationsEnabled: true
};

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<Settings>('office-drills-settings', defaultSettings);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    if (confirm('Reset all settings to defaults?')) {
      setSettings(defaultSettings);
      toast({ title: 'Settings reset to defaults' });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateSetting('notificationsEnabled', true);
        toast({ title: 'Notifications enabled' });
      } else {
        updateSetting('notificationsEnabled', false);
        toast({ 
          title: 'Notifications blocked',
          description: 'Please enable notifications in your browser settings',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your Office Drills experience</p>
        </div>
        <Button variant="outline" onClick={resetSettings}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timer Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timer Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="interval">Break Interval (minutes)</Label>
              <Input
                id="interval"
                type="number"
                min="1"
                max="300"
                value={settings.interval}
                onChange={(e) => updateSetting('interval', parseInt(e.target.value) || 30)}
              />
              <p className="text-sm text-muted-foreground">
                How often you want to take a break
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Default Exercise Category</Label>
              <Select 
                value={settings.selectedCategory} 
                onValueChange={(value: ExerciseCategory | 'All') => updateSetting('selectedCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {exerciseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-start">Auto-start timer on app launch</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically begin countdown when you open the app
                </p>
              </div>
              <Switch
                id="auto-start"
                checked={settings.autoStart}
                onCheckedChange={(checked) => updateSetting('autoStart', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cooldown">Exercise Cooldown</Label>
              <Input
                id="cooldown"
                type="number"
                min="0"
                max="20"
                value={settings.cooldownExercises}
                onChange={(e) => updateSetting('cooldownExercises', parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground">
                Avoid repeating exercises from the last N sessions (0 to disable)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Audio & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Audio & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications">Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when it's time for a break
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    requestNotificationPermission();
                  } else {
                    updateSetting('notificationsEnabled', false);
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="sound">Break Sound</Label>
                <p className="text-sm text-muted-foreground">
                  Play a sound when break time arrives
                </p>
              </div>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>

            {settings.soundEnabled && (
              <div className="space-y-2">
                <Label>Sound Volume</Label>
                <div className="flex items-center gap-4">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[settings.soundVolume]}
                    onValueChange={([value]) => updateSetting('soundVolume', value)}
                    max={1}
                    min={0}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-8">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
              </div>
            )}

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                if (settings.soundEnabled) {
                  console.log('🔊 Playing test sound at', settings.soundVolume * 100, '% volume');
                  toast({ title: 'Test sound played' });
                } else {
                  toast({ 
                    title: 'Sound is disabled',
                    description: 'Enable sound to test the break notification',
                    variant: 'destructive'
                  });
                }
              }}
            >
              Test Break Sound
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose your preferred color scheme
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Storage & Data */}
        <Card>
          <CardHeader>
            <CardTitle>Storage & Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Local Storage</h4>
              <p className="text-sm text-muted-foreground">
                All your data is stored locally in your browser. No cloud sync or external services are used.
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const data = {
                    settings: settings,
                    exercises: JSON.parse(localStorage.getItem('office-drills-exercises') || '[]'),
                    sessions: JSON.parse(localStorage.getItem('office-drills-sessions') || '[]')
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `office-drills-backup-${new Date().toISOString().split('T')[0]}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                  toast({ title: 'Backup created successfully' });
                }}
              >
                Export All Data
              </Button>

              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  if (confirm('This will delete ALL your data permanently. Are you sure?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}