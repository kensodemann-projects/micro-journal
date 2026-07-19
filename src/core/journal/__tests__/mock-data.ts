import type { Category, Entry, EntryType, Mood } from '../types';

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Daily Reflection',
    created_at: 1693526400000, // 2023-09-01
  },
  {
    id: 2,
    name: 'Midnight Thoughts',
    created_at: 1705276800000, // 2024-01-15
  },
  {
    id: 3,
    name: 'Wins & Milestones',
    created_at: 1711065600000, // 2024-03-22
  },
  {
    id: 4,
    name: 'Creative Sparks',
    created_at: 1717977600000, // 2024-06-10
  },
  {
    id: 5,
    name: 'Quiet Moments',
    created_at: 1725321600000, // 2024-09-03
  },
];

export const mockTypes: EntryType[] = [
  {
    id: 1,
    name: 'Journal',
    created_at: 1693526400000, // 2023-09-01
  },
  {
    id: 2,
    name: 'Note',
    created_at: 1705276800000, // 2024-01-15
  },
  {
    id: 3,
    name: 'Worry',
    created_at: 1711065600000, // 2024-03-22
  },
  {
    id: 4,
    name: 'Mood Check-in',
    created_at: 1717977600000, // 2024-06-10
  },
  {
    id: 5,
    name: 'Gratitude',
    created_at: 1725321600000, // 2024-09-03
  },
];

export const mockMoods: Mood[] = [
  {
    id: 1,
    name: 'Great',
    rank: 1,
    created_at: 1693526400000, // 2023-09-01
  },
  {
    id: 2,
    name: 'Okay',
    rank: 2,
    created_at: 1705276800000, // 2024-01-15
  },
  {
    id: 3,
    name: 'Low',
    rank: 3,
    created_at: 1711065600000, // 2024-03-22
  },
  {
    id: 4,
    name: 'Energized',
    rank: 1,
    created_at: 1717977600000, // 2024-06-10
  },
];

export const mockEntries: Entry[] = [
  {
    id: 1,
    created_at: 1727740800000, // 2024-10-01
    user_id: 42,
    date: '2024-10-01',
    entry_time: 1727769600000, // morning
    subject: 'Starting the month with intention',
    description: 'Took a quiet walk before work and set three priorities for the week.',
    category_id: mockCategories[0].id, // Daily Reflection
    type_id: mockTypes[0].id, // Journal
    mood_id: mockMoods[0].id, // Great
  },
  {
    id: 2,
    created_at: 1727913600000, // 2024-10-03
    user_id: 42,
    date: '2024-10-03',
    entry_time: 1727996400000, // late night
    subject: "Can't stop replaying the meeting",
    description: 'Worried I came across poorly in the client call. Need to ask for feedback tomorrow.',
    category_id: mockCategories[1].id, // Midnight Thoughts
    type_id: mockTypes[2].id, // Worry
    mood_id: mockMoods[2].id, // Low
  },
  {
    id: 3,
    created_at: 1728086400000, // 2024-10-05
    user_id: 42,
    date: '2024-10-05',
    entry_time: 1728129600000, // afternoon
    subject: 'Shipped the onboarding flow',
    description: 'Finally merged the PR. Users can complete signup without getting stuck.',
    category_id: mockCategories[2].id, // Wins & Milestones
    type_id: mockTypes[1].id, // Note
    mood_id: mockMoods[3].id, // Energized
  },
  {
    id: 4,
    created_at: 1728262800000, // 2024-10-07
    user_id: 42,
    date: '2024-10-07',
    entry_time: 1728291600000, // midday
    subject: 'Midday pulse check',
    description: 'Feeling steady — a little tired, but focused enough to finish the draft.',
    category_id: mockCategories[4].id, // Quiet Moments
    type_id: mockTypes[3].id, // Mood Check-in
    mood_id: mockMoods[1].id, // Okay
  },
  {
    id: 5,
    created_at: 1728435600000, // 2024-10-09
    user_id: 42,
    date: '2024-10-09',
    entry_time: 1728482400000, // evening
    subject: 'Sketchbook session',
    description: 'Grateful for an uninterrupted hour to draw. The blue ink idea finally clicked.',
    category_id: mockCategories[3].id, // Creative Sparks
    type_id: mockTypes[4].id, // Gratitude
    mood_id: mockMoods[0].id, // Great
  },
  {
    id: 6,
    created_at: 1728608400000, // 2024-10-11
    user_id: 42,
    date: '2024-10-11',
    entry_time: 1728651600000, // evening
    subject: 'Heavy day, soft landing',
    description: 'Sat with tea and wrote until the edge came off. Tomorrow can be slower.',
    category_id: mockCategories[4].id, // Quiet Moments
    type_id: mockTypes[0].id, // Journal
    mood_id: mockMoods[2].id, // Low
  },
  {
    id: 7,
    created_at: 1728781200000, // 2024-10-13
    user_id: 42,
    date: '2024-10-13',
    entry_time: 1728802800000, // morning
    subject: 'Idea: weekly highlight reel',
    description: 'Quick note — collect one win photo each Friday and stitch them into a month video.',
    category_id: mockCategories[3].id, // Creative Sparks
    type_id: mockTypes[1].id, // Note
    mood_id: mockMoods[3].id, // Energized
  },
  {
    id: 8,
    created_at: 1728954000000, // 2024-10-15
    user_id: 42,
    date: '2024-10-15',
    entry_time: 1729036800000, // late night
    subject: 'What if the launch slips?',
    description: "Spiraling a bit about timelines. Listing what's actually in my control.",
    category_id: mockCategories[1].id, // Midnight Thoughts
    type_id: mockTypes[2].id, // Worry
    mood_id: mockMoods[1].id, // Okay
  },
];
