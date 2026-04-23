export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number | null;
  registeredCount: number;
  isPaid: boolean;
  price: number | null;
  imageUrl: string | null;
  category: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
}
