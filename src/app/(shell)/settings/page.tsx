import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your chat interface preferences and keyboard shortcuts.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interface Density</CardTitle>
            <CardDescription>
              Adjust the spacing and size of UI elements for your comfort.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Compact</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Comfortable (Default)</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Spacious</span>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyboard Shortcuts</CardTitle>
            <CardDescription>
              Essential keyboard shortcuts for efficient navigation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Focus chat input</span>
                <Badge variant="outline" className="font-mono">Ctrl + /</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Send message</span>
                <Badge variant="outline" className="font-mono">Ctrl + Enter</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Open feature menu</span>
                <Badge variant="outline" className="font-mono">Ctrl + K</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Switch to Teacher mode</span>
                <Badge variant="outline" className="font-mono">Alt + T</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Switch to Learner mode</span>
                <Badge variant="outline" className="font-mono">Alt + L</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Skip to main content</span>
                <Badge variant="outline" className="font-mono">Tab</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}