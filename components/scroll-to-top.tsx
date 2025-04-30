"use client"

import { useEffect } from "react"

export default function ScrollToTop() {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0)
  }, [])

  // This component doesn't render anything
  return null
}
