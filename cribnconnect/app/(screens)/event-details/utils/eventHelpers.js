import {
  Camera,
  Gift,
  Heart,
  Music,
  Star,
  Users,
  Utensils,
  Wine,
  Zap,
} from 'lucide-react-native';

// Event category icons mapping
export const eventCategoryIcons = {
  'Concerts & Live Music': Music,
  'Club Night / Rave': Zap,
  'House Party': Users,
  'Karaoke Night': Music,
  'Comedy Show': Star,
  'Open Mic': Music,
  'Tech Conference': Users,
  'Networking Event': Users,
  'Workshops & Training': Star,
  'Startup Pitch Event': Star,
  'Career Fair': Users,
  'Art Exhibition': Star,
  'Poetry Slams': Star,
  'Cultural Festival': Star,
  'Photography Show': Camera,
  'Football Match / Viewing Party': Users,
  'Marathons & Runs': Star,
  'Fitness Bootcamp': Star,
  'Yoga / Wellness Sessions': Star,
  'Esports Tournament': Zap,
  'Food & Drink': Utensils,
  'Wine / Cocktail Tasting': Wine,
  'Cooking Classes': Utensils,
  'Pop-up Restaurants': Utensils,
  Wedding: Heart,
  Birthday: Gift,
  Anniversary: Heart,
  'Fashion show': Star,
  'Charity Gala': Star,
  'Book Club': Star,
  'Gaming Meetup': Zap,
  'Dance Classes': Music,
  'Language Exchange': Users,
  'Travel and Adventure trips': Star,
};

// Date formatting helper
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
};

// Price formatting helper
export const formatPrice = (price) => {
  if (!price || price === '0') return 'Free';
  return `₦${parseInt(price).toLocaleString()}`;
};
