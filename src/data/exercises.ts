import { Exercise, ExerciseCategory } from '../types';

export const defaultExercises: Exercise[] = [
  // Neck Exercises
  {
    id: 'neck-1',
    name: 'Neck Rolls',
    description: 'Gentle circular neck movements to relieve tension',
    duration: 30,
    category: 'Neck',
    instructions: [
      'Sit up straight with shoulders relaxed',
      'Slowly roll your head in a clockwise circle',
      'Complete 5 circles, then reverse direction',
      'Keep movements slow and controlled'
    ]
  },
  {
    id: 'neck-2',
    name: 'Neck Side Stretch',
    description: 'Lateral neck stretch to release side tension',
    duration: 30,
    category: 'Neck',
    instructions: [
      'Tilt your head to the right, ear toward shoulder',
      'Hold for 15 seconds',
      'Return to center and repeat on left side',
      'Keep shoulders down and relaxed'
    ]
  },
  {
    id: 'neck-3',
    name: 'Chin Tucks',
    description: 'Forward head posture correction exercise',
    duration: 30,
    category: 'Neck',
    instructions: [
      'Sit tall with shoulders back',
      'Pull your chin back, creating a double chin',
      'Hold for 5 seconds, repeat 6 times',
      'Feel the stretch at the base of your skull'
    ]
  },

  // Shoulder Exercises
  {
    id: 'shoulder-1',
    name: 'Shoulder Rolls',
    description: 'Release shoulder tension with gentle rolls',
    duration: 30,
    category: 'Shoulders',
    instructions: [
      'Roll shoulders up, back, and down in large circles',
      'Complete 10 rolls backward',
      'Then 10 rolls forward',
      'Keep movements smooth and controlled'
    ]
  },
  {
    id: 'shoulder-2',
    name: 'Shoulder Blade Squeeze',
    description: 'Strengthen muscles between shoulder blades',
    duration: 30,
    category: 'Shoulders',
    instructions: [
      'Sit up straight with arms at sides',
      'Squeeze shoulder blades together',
      'Hold for 5 seconds, release',
      'Repeat 6 times'
    ]
  },
  {
    id: 'shoulder-3',
    name: 'Cross-Body Shoulder Stretch',
    description: 'Stretch the posterior deltoid and upper back',
    duration: 30,
    category: 'Shoulders',
    instructions: [
      'Bring right arm across your body',
      'Use left hand to gently pull arm closer',
      'Hold for 15 seconds',
      'Repeat with left arm'
    ]
  },

  // Back Exercises
  {
    id: 'back-1',
    name: 'Seated Spinal Twist',
    description: 'Improve spinal mobility and reduce lower back tension',
    duration: 30,
    category: 'Back',
    instructions: [
      'Sit tall with feet flat on floor',
      'Place right hand on left knee',
      'Gently twist torso to the left',
      'Hold 15 seconds, repeat other side'
    ]
  },
  {
    id: 'back-2',
    name: 'Cat-Cow Stretch (Seated)',
    description: 'Mobilize the spine while seated',
    duration: 30,
    category: 'Back',
    instructions: [
      'Sit on edge of chair, hands on knees',
      'Arch back and look up (cow pose)',
      'Round back and drop head (cat pose)',
      'Alternate slowly for 30 seconds'
    ]
  },
  {
    id: 'back-3',
    name: 'Upper Back Extension',
    description: 'Counter forward head posture',
    duration: 30,
    category: 'Back',
    instructions: [
      'Interlace fingers behind head',
      'Open elbows wide',
      'Gently extend spine and lift chest',
      'Hold for 5 seconds, repeat 6 times'
    ]
  },

  // Hip Exercises
  {
    id: 'hip-1',
    name: 'Hip Flexor Stretch',
    description: 'Stretch tight hip flexors from prolonged sitting',
    duration: 30,
    category: 'Hips',
    instructions: [
      'Stand beside your chair',
      'Step right foot back into a lunge',
      'Keep torso upright and push hips forward',
      'Hold 15 seconds each side'
    ]
  },
  {
    id: 'hip-2',
    name: 'Seated Figure-4 Stretch',
    description: 'Hip opener for tight glutes and piriformis',
    duration: 30,
    category: 'Hips',
    instructions: [
      'Sit in chair with right ankle on left knee',
      'Gently lean forward until you feel a stretch',
      'Hold for 15 seconds',
      'Repeat with left ankle on right knee'
    ]
  },
  {
    id: 'hip-3',
    name: 'Hip Circles',
    description: 'Dynamic hip mobility exercise',
    duration: 30,
    category: 'Hips',
    instructions: [
      'Stand with hands on hips',
      'Make large circles with your hips',
      '10 circles clockwise, 10 counterclockwise',
      'Keep upper body stable'
    ]
  },

  // Leg Exercises
  {
    id: 'leg-1',
    name: 'Calf Raises',
    description: 'Improve circulation and strengthen calves',
    duration: 30,
    category: 'Legs',
    instructions: [
      'Stand behind your chair for support',
      'Rise up onto your toes',
      'Lower slowly with control',
      'Repeat for 30 seconds'
    ]
  },
  {
    id: 'leg-2',
    name: 'Hamstring Stretch',
    description: 'Stretch tight hamstrings from sitting',
    duration: 30,
    category: 'Legs',
    instructions: [
      'Extend right leg straight out',
      'Flex foot and reach toward toes',
      'Hold for 15 seconds',
      'Repeat with left leg'
    ]
  },
  {
    id: 'leg-3',
    name: 'Quad Stretch',
    description: 'Stretch the front thigh muscles',
    duration: 30,
    category: 'Legs',
    instructions: [
      'Stand and hold chair for balance',
      'Bend right knee, bringing heel to glute',
      'Hold ankle with right hand',
      'Hold 15 seconds each leg'
    ]
  },

  // Feet Exercises
  {
    id: 'feet-1',
    name: 'Ankle Circles',
    description: 'Improve ankle mobility and circulation',
    duration: 30,
    category: 'Feet',
    instructions: [
      'Lift right foot slightly off ground',
      'Make 10 circles clockwise',
      'Make 10 circles counterclockwise',
      'Repeat with left foot'
    ]
  },
  {
    id: 'feet-2',
    name: 'Toe Points and Flexes',
    description: 'Stretch calves and shins',
    duration: 30,
    category: 'Feet',
    instructions: [
      'Extend legs and point toes away',
      'Hold for 3 seconds',
      'Flex feet back toward shins',
      'Repeat for 30 seconds'
    ]
  },
  {
    id: 'feet-3',
    name: 'Heel-Toe Walks',
    description: 'Improve balance and ankle stability',
    duration: 30,
    category: 'Feet',
    instructions: [
      'Stand and walk in place',
      'Place heel of one foot directly in front of toes of other',
      'Walk heel-to-toe for 10 steps',
      'Turn around and repeat'
    ]
  },

  // Hand Exercises
  {
    id: 'hand-1',
    name: 'Wrist Circles',
    description: 'Improve wrist mobility and reduce stiffness',
    duration: 30,
    category: 'Hands',
    instructions: [
      'Extend arms in front of you',
      'Make circles with your wrists',
      '10 circles in each direction',
      'Keep movements slow and controlled'
    ]
  },
  {
    id: 'hand-2',
    name: 'Finger Stretches',
    description: 'Relieve finger and hand tension',
    duration: 30,
    category: 'Hands',
    instructions: [
      'Make a fist, then spread fingers wide',
      'Hold spread for 5 seconds',
      'Repeat 6 times',
      'Shake hands out gently'
    ]
  },
  {
    id: 'hand-3',
    name: 'Prayer Stretch',
    description: 'Stretch wrists and forearms',
    duration: 30,
    category: 'Hands',
    instructions: [
      'Press palms together in front of chest',
      'Lower hands while keeping palms together',
      'Feel stretch in wrists and forearms',
      'Hold for 15 seconds, repeat'
    ]
  },

  // Full-Body Exercises
  {
    id: 'fullbody-1',
    name: 'Standing Desk Stretch',
    description: 'Full body stretch sequence',
    duration: 30,
    category: 'Full-Body',
    instructions: [
      'Stand and reach arms overhead',
      'Lean gently to the right, then left',
      'Reach forward and round spine',
      'Stand and repeat sequence'
    ]
  },
  {
    id: 'fullbody-2',
    name: 'Desk Push-ups',
    description: 'Upper body strength exercise using desk',
    duration: 30,
    category: 'Full-Body',
    instructions: [
      'Place hands on edge of desk',
      'Step feet back into plank position',
      'Perform push-ups against desk',
      'Complete as many as possible in 30 seconds'
    ]
  },
  {
    id: 'fullbody-3',
    name: 'Chair Squats',
    description: 'Lower body strengthening exercise',
    duration: 30,
    category: 'Full-Body',
    instructions: [
      'Stand in front of your chair',
      'Lower down as if sitting, but don\'t sit',
      'Stand back up when you barely touch chair',
      'Repeat for 30 seconds'
    ]
  },

  // Stretch Exercises
  {
    id: 'stretch-1',
    name: 'Side Body Stretch',
    description: 'Lengthen the sides of your torso',
    duration: 30,
    category: 'Stretch',
    instructions: [
      'Raise right arm overhead',
      'Lean to the left, feeling stretch on right side',
      'Hold for 15 seconds',
      'Repeat on other side'
    ]
  },
  {
    id: 'stretch-2',
    name: 'Forward Fold',
    description: 'Release tension in back and hamstrings',
    duration: 30,
    category: 'Stretch',
    instructions: [
      'Stand with feet hip-width apart',
      'Slowly fold forward from hips',
      'Let arms hang down toward floor',
      'Hold for 15-30 seconds'
    ]
  },
  {
    id: 'stretch-3',
    name: 'Chest Doorway Stretch',
    description: 'Open chest and improve posture',
    duration: 30,
    category: 'Stretch',
    instructions: [
      'Stand in doorway with arms on frame',
      'Step forward gently',
      'Feel stretch across chest',
      'Hold for 15-30 seconds'
    ]
  },

  // Strength Exercises
  {
    id: 'strength-1',
    name: 'Wall Push-ups',
    description: 'Upper body strengthening exercise',
    duration: 30,
    category: 'Strength',
    instructions: [
      'Stand arm\'s length from wall',
      'Place palms flat against wall',
      'Push away from wall and return',
      'Repeat for 30 seconds'
    ]
  },
  {
    id: 'strength-2',
    name: 'Glute Squeezes',
    description: 'Activate and strengthen glutes',
    duration: 30,
    category: 'Strength',
    instructions: [
      'Sit or stand with feet hip-width apart',
      'Squeeze glute muscles tight',
      'Hold for 5 seconds, release',
      'Repeat for 30 seconds'
    ]
  },
  {
    id: 'strength-3',
    name: 'Standing Marches',
    description: 'Core activation and balance',
    duration: 30,
    category: 'Strength',
    instructions: [
      'Stand tall with hands on hips',
      'Lift right knee toward chest',
      'Lower and lift left knee',
      'Continue marching for 30 seconds'
    ]
  }
];

export const exerciseCategories: ExerciseCategory[] = [
  'Neck',
  'Shoulders', 
  'Back',
  'Hips',
  'Legs',
  'Feet',
  'Hands',
  'Full-Body',
  'Stretch',
  'Strength'
];