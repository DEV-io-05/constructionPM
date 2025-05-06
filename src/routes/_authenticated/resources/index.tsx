import { createFileRoute } from '@tanstack/react-router'
import Resource from '@/features/resources'

export const Route = createFileRoute('/_authenticated/resources/')({
  component: Resource,
})
