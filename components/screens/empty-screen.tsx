import { Card, CardContent } from "@/components/ui/card"

interface EmptyScreenProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function EmptyScreen({icon, title, description}: EmptyScreenProps) {
  return (
    <Card className="border-dashed border-2 bg-background/50 mx-auto max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-10 px-6">
        <div className="rounded-full bg-muted p-3 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground text-center">{description}</p>
      </CardContent>
    </Card>
  )
}

