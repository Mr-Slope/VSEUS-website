export interface EventQuestion {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'yes_no';
  options: string[];
  required: boolean;
}

export interface QuestionAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  isPaid: boolean;
  price: number | null;
  imageUrl: string | null;
  posterUrl: string | null;
  category: string;
  createdAt: string;
  questions: EventQuestion[];
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  userName: string;
  userEmail: string;
  userStudentId: string;
  ticketEmail: string;
  registeredAt: string;
  answers: QuestionAnswer[];
  attended: boolean;
  attendedAt: string | null;
}
