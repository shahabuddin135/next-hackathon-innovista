"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OnlineToolTab } from "@/components/tabs/OnlineToolTab"
import { VisualizeTab } from "@/components/tabs/VisualizeTab"
import { QuizTab } from "@/components/tabs/QuizTab"
import { RoadmapDialog } from "@/components/dialogs/RoadmapDialog"
import { QuizDialog } from "@/components/dialogs/QuizDialog"
import { type UserRole } from "@/components/Header"
import { 
  Search, 
  Eye, 
  Brain,
  Map,
  Plus,
  X
} from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface FeatureTabsProps {
  currentRole: UserRole
}

export function FeatureTabs({ currentRole }: FeatureTabsProps) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [roadmapDialogOpen, setRoadmapDialogOpen] = useState(false)
  const [quizDialogOpen, setQuizDialogOpen] = useState(false)

  const handleTabChange = (value: string) => {
    if (value === activeTab) {
      setActiveTab(null) // Close if same tab clicked
    } else {
      setActiveTab(value)
    }
  }

  if (!activeTab) {
    return (
      <>
        {/* Feature Action Chips */}
        <div className="border-t border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("online-tool")}
              className="h-8 gap-2"
            >
              <Search className="h-3 w-3" />
              {t("online_search")}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("visualize")}
              className="h-8 gap-2"
            >
              <Eye className="h-3 w-3" />
              {t("visualize")}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("quiz")}
              className="h-8 gap-2"
            >
              <Brain className="h-3 w-3" />
              {currentRole === "teach" ? t("make_quiz") : t("take_quiz")}
            </Button>

            {/* Teacher-only features */}
            {currentRole === "teach" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRoadmapDialogOpen(true)}
                  className="h-8 gap-2"
                >
                  <Map className="h-3 w-3" />
                  {t("make_roadmap")}
                </Button>
              </>
            )}

            <div className="hidden sm:flex items-center gap-2 ml-auto">
              <Badge variant="secondary" className="text-xs">
                {t("activate_features_hint")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Teacher Dialogs */}
        <RoadmapDialog 
          open={roadmapDialogOpen} 
          onOpenChange={setRoadmapDialogOpen} 
        />
        <QuizDialog 
          open={quizDialogOpen} 
          onOpenChange={setQuizDialogOpen} 
        />
      </>
    )
  }

  return (
    <>
      <div className="border-t border-border bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <TabsList className="h-9 bg-transparent p-0 space-x-1">
              <TabsTrigger 
                value="online-tool" 
                className="h-8 px-3 data-[state=active]:bg-background"
              >
                <Search className="h-3 w-3 mr-1" />
                {t("online_search")}
              </TabsTrigger>
              <TabsTrigger 
                value="visualize" 
                className="h-8 px-3 data-[state=active]:bg-background"
              >
                <Eye className="h-3 w-3 mr-1" />
                {t("visualize")}
              </TabsTrigger>
              <TabsTrigger 
                value="quiz" 
                className="h-8 px-3 data-[state=active]:bg-background"
              >
                <Brain className="h-3 w-3 mr-1" />
                {currentRole === "teach" ? t("make_quiz") : t("take_quiz")}
              </TabsTrigger>
            </TabsList>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(null)}
              className="h-8 w-8 p-0"
              aria-label="Close feature tabs"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <TabsContent value="online-tool" className="m-0 p-4">
              <OnlineToolTab />
            </TabsContent>
            
            <TabsContent value="visualize" className="m-0 p-4">
              <VisualizeTab />
            </TabsContent>
            
            <TabsContent value="quiz" className="m-0 p-4">
              <QuizTab currentRole={currentRole} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Teacher Dialogs */}
      <RoadmapDialog 
        open={roadmapDialogOpen} 
        onOpenChange={setRoadmapDialogOpen} 
      />
      <QuizDialog 
        open={quizDialogOpen} 
        onOpenChange={setQuizDialogOpen} 
      />
    </>
  )
}