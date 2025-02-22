import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  QueryClient,
  QueryClientProvider,
 
} from '@tanstack/react-query'
import App from './App'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <QueryClientProvider client={queryClient}>
     <DndProvider backend={HTML5Backend}>
    <App />
    </DndProvider>
    </QueryClientProvider>
  </StrictMode>,
)
