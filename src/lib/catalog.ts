import type { Component } from 'svelte'
import HoldToDelete from './experiments/HoldToDelete.svelte'
import TextShimmer from './experiments/TextShimmer.svelte'

type Experiment = {
  id: string
  component: Component
  credits?: {
    name: string
    url: string
  }
}
export default [
  {
    id: 'hold-to-delete',
    component: HoldToDelete,
    credits: {
      name: 'Emil Kowalski',
      url: 'https://emilkowal.ski/ui/building-a-hold-to-delete-component'
    }
  },
  {
    id: 'text-shimmer',
    component: TextShimmer
  }
] as Experiment[]
