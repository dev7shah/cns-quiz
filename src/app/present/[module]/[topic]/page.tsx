import { notFound } from "next/navigation"
import { getPresentation } from "@/lib/present/plates"
import { PresenterModeV2 } from "@/components/present/PresenterModeV2"

export function generateStaticParams() {
  return [
    { module: 'm1', topic: 'caesar' },
    { module: 'm1', topic: 'playfair' },
    { module: 'm1', topic: 'hill' },
    { module: 'm1', topic: 'affine' },
    { module: 'm1', topic: 'principles' }
  ]
}

export const instant = false

export default async function PresentTopicPage({
  params
}: {
  params: Promise<{ module: string; topic: string }>
}) {
  const { module: modId, topic: topicId } = await params
  const presentation = getPresentation(modId, topicId)

  if (!presentation) {
    notFound()
  }

  return <PresenterModeV2 presentation={presentation} />
}
