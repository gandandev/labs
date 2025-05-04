import type { SvelteComponent } from 'svelte'
import HoldToDelete from './experiments/HoldToDelete.svelte'

type Experiment = {
  id: string
  component: typeof SvelteComponent
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
  }
] as Experiment[]
