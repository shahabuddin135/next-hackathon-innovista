"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Globe, ExternalLink } from "lucide-react"

export function OnlineToolTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSearching(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Online Search
        </h3>
        <p className="text-sm text-muted-foreground">
          Search the web for current information to enhance your learning or teaching.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Web Search</CardTitle>
          <CardDescription>
            Search for articles, research papers, tutorials, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your search query..."
              disabled={isSearching}
            />
            <Button 
              type="submit" 
              disabled={!searchQuery.trim() || isSearching}
              className="shrink-0"
            >
              {isSearching ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>

          {isSearching && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Searching the web...</div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isSearching && searchQuery && (
            <div className="space-y-3">
              <Badge variant="outline" className="w-fit">
                UI Demo - No actual search performed
              </Badge>
              <div className="text-sm text-muted-foreground">
                In the full version, this will search the web and return relevant results 
                that can be used to enhance your conversations.
              </div>
            </div>
          )}

          {!searchQuery && !isSearching && (
            <div className="space-y-3 text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Ready to search</p>
                <p className="text-sm text-muted-foreground">
                  Enter a query to find relevant information from the web
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start h-8">
              <ExternalLink className="h-3 w-3 mr-2" />
              Wikipedia
            </Button>
            <Button variant="outline" size="sm" className="justify-start h-8">
              <ExternalLink className="h-3 w-3 mr-2" />
              Khan Academy
            </Button>
            <Button variant="outline" size="sm" className="justify-start h-8">
              <ExternalLink className="h-3 w-3 mr-2" />
              Coursera
            </Button>
            <Button variant="outline" size="sm" className="justify-start h-8">
              <ExternalLink className="h-3 w-3 mr-2" />
              MIT OpenCourseWare
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}