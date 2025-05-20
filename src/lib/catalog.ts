import type { Component } from 'svelte'
import HoldToDelete from './experiments/HoldToDelete.svelte'
import TextShimmer from './experiments/TextShimmer.svelte'
import DynamicIslandScreenRecording from './experiments/DynamicIslandScreenRecording.svelte'
import VoiceNote from './experiments/VoiceNote.svelte'

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

const experiments: Experiment[] = [
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
  },
  {
    id: 'dynamic-island-screen-recording',
    component: DynamicIslandScreenRecording,
    startDate: '2025-05-06',
    endDate: '2025-05-11',
    credits: {
      name: 'Apple',
      url: 'https://www.youtube.com/watch?v=m6WMwSj_EbA&t=523s'
    }
  },
  {
    id: 'voice-note',
    component: VoiceNote,
    startDate: '2025-05-18',
    endDate: '2025-05-20',
    credits: {
      name: 'Nitish Khagwal',
      url: 'https://x.com/nitishkmrk/status/1902610054089457684'
    }
  }
]

experiments.sort((a, b) => {
  const endDateComparison = b.endDate.localeCompare(a.endDate)
  if (endDateComparison !== 0) return endDateComparison
  return b.startDate.localeCompare(a.startDate)
})

export default experiments
