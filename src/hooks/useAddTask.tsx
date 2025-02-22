import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

import { Task } from "./types";

const addTask = async ({
  newTask,
  userId,
}: {
  newTask: Omit<Task, "id" | "userId">;
  userId: string;
}): Promise<Task> => {
  const tasksCollection = collection(db, "tasks");
  const docRef = await addDoc(tasksCollection, { ...newTask, userId }); // Include userId
  return { id: docRef.id, ...newTask, userId };
};

export const useAddTask = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, Omit<Task, "id" | "userId">>({
    mutationFn: (newTask) => addTask({ newTask, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
