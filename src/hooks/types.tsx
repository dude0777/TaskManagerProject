// types.ts
export interface Task {
    id: string; // Optional because it's added by Firebase
    title: string;
    description?: string;
    status: string;
    dueDate: string | null;
    fileURL: string | null;
    tags?: string[];
    activities: Activity[];
    userId?: string;
    type:string
  }
  
  export interface Activity {
    name: string;
    time: string;
  }