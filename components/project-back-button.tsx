"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ProjectBackButton() {
    const router = useRouter()

    const handleBack = () => {
        // Check if there is history to go back to
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back()
        } else {
            router.push("/#projects")
        }
    }

    return (
        <Button
            variant="ghost"
            className="mb-8 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleBack}
        >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
    )
}
