export interface Event {
  category: string;
  id: string;
  title: string;
  description: string;
  date: string;
  createdBy: string;
}

export interface Events {
  currentPage: number;
  totalEvents: number;
  totalPages: number;
  events: Event[];
}