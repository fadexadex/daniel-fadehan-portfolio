import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Loading() {
    return (
        <div className="min-h-screen pt-20 pb-16 w-full overflow-x-hidden">
            <div className="container px-4 mx-auto">
                <div className="mb-8">
                    <Button variant="ghost" className="mb-8 -ml-2 text-muted-foreground" disabled>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                    </Button>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Skeleton className="h-6 w-32 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>

                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <div className="space-y-2 mb-6 max-w-3xl">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-32" />
                    </div>

                    <div className="flex gap-4 mb-8">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Project Image */}
                <div className="mb-12 flex justify-center">
                    <div className="max-w-3xl w-full rounded-xl overflow-hidden border border-border">
                        <div className="relative aspect-[16/9] w-full">
                            <Skeleton className="w-full h-full" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mb-8">
                    <Skeleton className="h-10 w-64" />
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-1/2 mt-8" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        </div>
    )
}
