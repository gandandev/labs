import type { Component } from 'svelte'
import HoldToDelete from './experiments/HoldToDelete.svelte'
import TextShimmer from './experiments/TextShimmer.svelte'

type Experiment = {
  id: string
  component: Component
  startDate: string
  endDate: string
  credits?: {
    name: string
    url: string
  }
}
export default [
  {
    id: 'hold-to-delete',
    component: HoldToDelete,
    startDate: '2025-05-04',
    endDate: '2025-05-05',
    credits: {
      name: 'Emil Kowalski',
      url: 'https://emilkowal.ski/ui/building-a-hold-to-delete-component'
    }
  },
  {
    id: 'text-shimmer',
    component: TextShimmer,
    startDate: '2025-05-05',
    endDate: '2025-05-05'
  }
] as Experiment[]
