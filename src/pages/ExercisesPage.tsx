import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExercises } from '../hooks/useExercises';
import { Exercise, ExerciseCategory } from '../types';
import { exerciseCategories } from '../data/exercises';
import { Plus, Edit, Trash2, Search, Download, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExercisesPage() {
  const { exercises, addExercise, updateExercise, deleteExercise, resetToDefaults } = useExercises();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || exercise.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveExercise = (exerciseData: Partial<Exercise>) => {
    if (editingExercise) {
      updateExercise({ ...editingExercise, ...exerciseData } as Exercise);
      toast({ title: 'Exercise updated successfully' });
    } else {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: exerciseData.name || '',
        description: exerciseData.description || '',
        duration: exerciseData.duration || 30,
        category: exerciseData.category || 'Stretch',
        instructions: exerciseData.instructions || []
      };
      addExercise(newExercise);
      toast({ title: 'Exercise added successfully' });
    }
    setEditingExercise(null);
    setIsDialogOpen(false);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    deleteExercise(exerciseId);
    toast({ title: 'Exercise deleted successfully' });
  };

  const handleExportExercises = () => {
    const dataStr = JSON.stringify(exercises, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'office-drills-exercises.json';
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exercises exported successfully' });
  };

  const handleImportExercises = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedExercises = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedExercises)) {
          importedExercises.forEach(exercise => {
            if (exercise.name && exercise.category) {
              addExercise({ ...exercise, id: Date.now().toString() + Math.random() });
            }
          });
          toast({ title: 'Exercises imported successfully' });
        }
      } catch (error) {
        toast({ 
          title: 'Import failed',
          description: 'Invalid JSON file format',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('This will reset all exercises to defaults. Are you sure?')) {
      resetToDefaults();
      toast({ title: 'Exercises reset to defaults' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exercise Library</h1>
          <p className="text-muted-foreground">Manage your collection of micro-break exercises</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            onChange={handleImportExercises}
            className="hidden"
            id="import-exercises"
          />
          <label htmlFor="import-exercises">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </label>
          <Button variant="outline" onClick={handleExportExercises}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exercises ({filteredExercises.length})</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingExercise(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
                  </DialogTitle>
                </DialogHeader>
                <ExerciseForm
                  exercise={editingExercise}
                  onSave={handleSaveExercise}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search exercises</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="category-filter">Filter by category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{exercise.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {exercise.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.duration}s
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Instructions:</Label>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {exercise.instructions.slice(0, 2).map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                      {exercise.instructions.length > 2 && (
                        <li className="text-muted-foreground/70">
                          +{exercise.instructions.length - 2} more steps
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingExercise(exercise);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteExercise(exercise.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No exercises found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ExerciseFormProps {
  exercise: Exercise | null;
  onSave: (exercise: Partial<Exercise>) => void;
  onCancel: () => void;
}

function ExerciseForm({ exercise, onSave, onCancel }: ExerciseFormProps) {
  const [formData, setFormData] = useState({
    name: exercise?.name || '',
    description: exercise?.description || '',
    duration: exercise?.duration || 30,
    category: exercise?.category || 'Stretch' as ExerciseCategory,
    instructions: exercise?.instructions || ['']
  });

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, '']
    });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInstructions = formData.instructions.filter(instruction => instruction.trim() !== '');
    onSave({ ...formData, instructions: cleanInstructions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Exercise Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="300"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value: ExerciseCategory) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {exerciseCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div>
        <Label>Instructions</Label>
        <div className="space-y-2">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1"
              />
              {formData.instructions.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeInstruction(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addInstruction}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {exercise ? 'Update Exercise' : 'Add Exercise'}
        </Button>
      </div>
    </form>
  );
}