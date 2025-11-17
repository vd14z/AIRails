import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type FeedbackEntry = {
  id: string
  artifact: 'pipeline' | 'generator' | 'summary'
  comment: string
  rating: number
  createdAt: string
}

type AiFeedbackState = {
  entries: FeedbackEntry[]
  addEntry: (entry: Omit<FeedbackEntry, 'id' | 'createdAt'>) => void
}

export const useAiFeedbackStore = create<AiFeedbackState>()(
  devtools(
    persist(
      (set) => ({
        entries: [],
        addEntry: (entry) =>
          set((state) => ({
            entries: [
              {
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                ...entry,
              },
              ...state.entries,
            ].slice(0, 25),
          })),
      }),
      { name: 'ai-feedback' },
    ),
  ),
)

