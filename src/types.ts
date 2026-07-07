export interface Booking {
  id: string;
  name: string;
  email: string;
  businessName: string;
  packageName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface FormSubmission {
  id: string;
  businessName: string;
  businessType: string;
  designPreference: string;
  keyFeatures: string[];
  primaryColor: string;
  email: string;
  submittedAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  replyText?: string;
  repliedAt?: string;
}

export interface WebTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  colorTheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  tagline: string;
  sections: {
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
    services: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
