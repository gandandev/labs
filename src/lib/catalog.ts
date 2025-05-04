import type { SvelteComponent } from 'svelte'
import TestButton from './experiments/TestButton.svelte'

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
    id: 'test-button',
    component: TestButton,
    credits: {
      name: 'John Doe',
      url: 'https://example.com'
    }
  }
] as Experiment[]
