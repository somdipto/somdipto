import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface AppState {
  threads: Thread[];
  activeThreadId: string | null;
  createThread: (initialMessage: string) => void;
  addMessage: (threadId: string, message: Omit<Message, 'id'>) => void;
  setActiveThread: (id: string | null) => void;
  deleteThread: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  threads: [],
  activeThreadId: null,
  createThread: (initialMessage) =>
    set((state) => {
      const newThread: Thread = {
        id: Date.now().toString(),
        title:
          initialMessage.slice(0, 30) +
          (initialMessage.length > 30 ? '...' : ''),
        messages: [
          {
            id: Date.now().toString(),
            role: 'user',
            content: initialMessage,
          },
        ],
        createdAt: Date.now(),
      };
      return {
        threads: [newThread, ...state.threads],
        activeThreadId: newThread.id,
      };
    }),
  addMessage: (threadId, message) =>
    set((state) => ({
      threads: state.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { ...message, id: Date.now().toString() },
              ],
            }
          : t,
      ),
    })),
  setActiveThread: (id) => set({ activeThreadId: id }),
  deleteThread: (id) =>
    set((state) => ({
      threads: state.threads.filter((t) => t.id !== id),
      activeThreadId: state.activeThreadId === id ? null : state.activeThreadId,
    })),
}));
