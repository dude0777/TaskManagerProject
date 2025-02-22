import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { Task } from "./types";

// Batch Update Hook
export const useUpdateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Array<{ id: string, data: Partial<Task> }>>({
    mutationFn: async (updates) => {
      const batch = writeBatch(db);
      
      updates.forEach(({ id, data }) => {
        const taskDoc = doc(db, "tasks", id);
        batch.update(taskDoc, data);
      });

      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// Batch Delete Hook
export const useDeleteTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string[]>({
    mutationFn: async (ids) => {
      const batch = writeBatch(db);
      
      ids.forEach(id => {
        const taskDoc = doc(db, "tasks", id);
        batch.delete(taskDoc);
      });

      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};