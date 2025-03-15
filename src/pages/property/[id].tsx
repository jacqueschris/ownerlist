"use client"

import { PropertyDetail } from "@/components/screens/property-detail"
import { Layout } from "@/components/layout"
import { useRouter } from "next/router"

export default function PropertyPage() {
  const router = useRouter()
  const { id } = router.query

  return <Layout>{id && <PropertyDetail id={id as string} />}</Layout>
}

