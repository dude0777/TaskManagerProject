// useUpdateTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

import { Task } from "./types";

const updateTask = async ({ id, updatedTask }: { id: string; updatedTask: Partial<Task> }): Promise<void> => {
  const taskDoc = doc(db, "tasks", id);
  await updateDoc(taskDoc, updatedTask);
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; updatedTask: Partial<Task> }>({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};