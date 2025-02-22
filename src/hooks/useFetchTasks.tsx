import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";

import { Task } from "./types";

const fetchTasks = async (userId: string): Promise<Task[]> => {
  if (!userId) throw new Error("User is not authenticated");

  const tasksCollection = collection(db, "tasks");
  const userTasksQuery = query(tasksCollection, where("userId", "==", userId)); // Fetch only user-specific tasks
  const tasksSnapshot = await getDocs(userTasksQuery);

  return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
};

export const useFetchTasks = (userId: string) => {
  return useQuery<Task[], Error>({
    queryKey: ["tasks", userId],
    queryFn: () => fetchTasks(userId),
    enabled: !!userId, // Prevent fetching if userId is not available
  });
};
