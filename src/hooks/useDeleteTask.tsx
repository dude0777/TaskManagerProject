// useDeleteTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";


const deleteTask = async (id: string): Promise<void> => {
  const taskDoc = doc(db, "tasks", id);
  await deleteDoc(taskDoc);
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};