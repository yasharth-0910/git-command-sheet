"use client"

import { useState } from "react"
import { Copy, Search, Heart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Command {
  code: string
  description: string
}

interface Section {
  title: string
  commands: Command[]
}

const gitCommands: Section[] = [
  {
    title: "Create",
    commands: [
      { code: "git init", description: "Initialize a new Git repo." },
      { code: "git clone <repo-url>", description: "Clone a remote repo." },
    ],
  },
  {
    title: "Branches",
    commands: [
      { code: "git branch", description: "List all local branches." },
      { code: "git branch -av", description: "List all local and remote branches." },
      { code: "git checkout <branch>", description: "Switch to a branch." },
      { code: "git switch <branch>", description: "Switch to a branch (modern)." },
      { code: "git branch -d <branch>", description: "Delete a branch." },
      { code: "git branch -m <new-name>", description: "Rename the current branch." },
    ],
  },
  {
    title: "Local Changes",
    commands: [
      { code: "git status", description: "List new or modified files not committed." },
      { code: "git add <file>", description: "Stage a file." },
      { code: "git add .", description: "Stage all changes." },
      { code: "git restore <file>", description: "Discard changes in a file." },
      { code: "git restore --staged <file>", description: "Unstage a file." },
      { code: "git diff", description: "Show unstaged changes." },
      { code: "git diff --staged", description: "Show staged changes." },
    ],
  },
  {
    title: "Commit History",
    commands: [
      { code: "git log", description: "Show full change history." },
      { code: "git log --oneline", description: "Compact commit history." },
      { code: "git log --graph", description: "Show commit history with a graph." },
      { code: "git show <commit>", description: "Show details of a specific commit." },
    ],
  },
  {
    title: "Remote",
    commands: [
      { code: "git remote -v", description: "List all remotes with URLs." },
      { code: "git fetch <remote>", description: "Fetch changes from a remote." },
      { code: "git pull <remote> <branch>", description: "Fetch and merge changes from a remote." },
      { code: "git push <remote> <branch>", description: "Push changes to a remote." },
      { code: "git push -u <remote> <branch>", description: "Push and set upstream branch." },
    ],
  },
  {
    title: "Stash",
    commands: [
      { code: "git stash", description: "Temporarily save changes." },
      { code: "git stash list", description: "List all stashes." },
      { code: "git stash apply", description: "Apply the most recent stash." },
      { code: "git stash pop", description: "Apply and remove the most recent stash." },
      { code: "git stash drop", description: "Delete the most recent stash." },
    ],
  },
  {
    title: "Undo",
    commands: [
      { code: "git reset <file>", description: "Unstage a file." },
      { code: "git reset --soft <commit>", description: "Move HEAD to a commit, keep changes staged." },
      { code: "git reset --hard <commit>", description: "Move HEAD to a commit, discard all changes." },
      { code: "git revert <commit>", description: "Create a new commit that undoes a previous commit." },
    ],
  },
  {
    title: "Advanced",
    commands: [
      { code: "git rebase <branch>", description: "Rebase the current branch onto another." },
      { code: "git cherry-pick <commit>", description: "Apply a specific commit to the current branch." },
      { code: "git bisect", description: "Binary search to find a buggy commit." },
      { code: "git reflog", description: "Show a log of all reference changes." },
    ],
  },
]

export default function GitCheatSheet() {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const filteredCommands = gitCommands
    .map((section) => ({
      ...section,
      commands: section.commands.filter(
        (command) =>
          command.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          command.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.commands.length > 0)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCommand(text)
      setTimeout(() => setCopiedCommand(null), 1000) // Reset after 1 second
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2">
          <img
            src="https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png" 
            alt="Git Logo"
            className="w-10 h-10" 
          />
          <h1 className="text-3xl font-bold">Git Cheat Sheet</h1>
        </div>
        <p className="text-gray-400 mt-2">All the essential Git commands in one place.</p>
      </header>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-800 text-gray-100"
          />
        </div>

        {filteredCommands.map((section) => (
          <section key={section.title} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.commands.map((command) => (
                <div
                  key={command.code}
                  className="bg-gray-900 text-gray-100 p-4 rounded-lg border border-gray-800"
                >
                  <div className="flex justify-between items-center">
                    <code className="font-mono text-sm bg-gray-800 p-2 rounded">{command.code}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(command.code)}
                      className="text-gray-400 hover:text-gray-100"
                    >
                      {copiedCommand === command.code ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="sr-only">Copy to clipboard</span>
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{command.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <footer className="text-center mt-8 text-sm text-gray-400">
          <p className="flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by Yasharth Singh from{" "}
            <a
              href="https://cicr.in" // Replace with the actual URL if available
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 ml-1"
            >
              CICR 
            </a>
             -The Robotics Club of JIIT-128
          </p>
        </footer> 
      </div>
    </div>
  )
}