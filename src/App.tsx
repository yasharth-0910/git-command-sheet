"use client"

import { useState } from "react"
import { Copy, Search, Heart, Check, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { useEffect } from "react"

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
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)

  // Remove searchQuery state since we'll use searchValue instead
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [commandInput, setCommandInput] = useState("");
  const [commandOutput, setCommandOutput] = useState<string[]>([]);

  // Update the filtered commands to use searchValue
  const filteredCommands = gitCommands
    .map((section) => ({
      ...section,
      commands: section.commands.filter(
        (command) =>
          command.code.toLowerCase().includes(searchValue.toLowerCase()) ||
          command.description.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    }))
    .filter((section) => section.commands.length > 0);

  // Add keyboard shortcut effect
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Initialize sandbox
  // Add near the top of your file, after imports
  const API_URL = import.meta.env.VITE_API_URL;
  
  // Then update all fetch calls to use API_URL
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize sandbox
  const initializeSandbox = async () => {
    try {
      const response = await fetch(`${API_URL}/init-sandbox`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        console.log("Sandbox initialized:", data.sandboxDir);
      }
    } catch (error) {
      console.error("Error initializing sandbox:", error);
    }
  };

  const executeCommand = async (command: string) => {
    // Allow both git and basic shell commands
    const allowedCommands = ['git', 'ls', 'pwd', 'cd', 'mkdir', 'touch'];
    const commandParts = command.split(' ');
    const baseCommand = commandParts[0];

    if (!allowedCommands.includes(baseCommand)) {
      console.error("Invalid command format:", command);
      setCommandOutput((prev) => [...prev, `$ ${command}`, "Error: Command not allowed. Allowed commands: ${allowedCommands.join(', ')}"]);
      return;
    }
  
    console.log("Sending command:", command);
  
    try {
      const response = await fetch(`${API_URL}/execute-command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, sessionId }),
      });
  
      const data = await response.json();
      console.log("Response received:", data);
  
      if (data.success) {
        setCommandOutput((prev) => [...prev, `$ ${command}`, data.output]);
      } else {
        setCommandOutput((prev) => [...prev, `$ ${command}`, `Error: ${data.error}`]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setCommandOutput((prev) => [...prev, `$ ${command}`, `Error: ${errorMessage}`]);
    }
  };
  
  // Clean up sandbox
  const cleanupSandbox = async () => {
    if (sessionId) {
      try {
        await fetch(`${API_URL}/cleanup-sandbox`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch (error) {
        console.error("Error cleaning up sandbox:", error);
      }
    }
  };

  // Initialize sandbox on component mount
  useEffect(() => {
    initializeSandbox();
    return () => {
      cleanupSandbox();
    };
  }, []);

  // Handle command input
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    executeCommand(commandInput);
    setCommandInput("");
  };

  // Copy command to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCommand(text);
      setTimeout(() => setCopiedCommand(null), 1000); // Reset after 1 second
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img
              src="https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png" 
              alt="Git Logo"
              className="w-12 h-12" 
            />
            <h1 className="text-4xl font-bold tracking-tight">Git Cheat Sheet</h1>
          </div>
          <p className="text-gray-400 text-lg">All the essential Git commands in one place.</p>
          <Separator className="my-4 bg-gray-800" />
        </header>

        {/* Command Search Bar - keeping existing code */}
        <div className="mb-8">
          <Button
            variant="outline"
            className="relative w-full justify-start text-sm text-muted-foreground bg-gray-900 border-gray-800"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search Git commands...</span>
            <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Command Search Dialog - Updated styling */}
        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command className="bg-gray-950 border-gray-800 rounded-xl shadow-2xl">
            <CommandInput 
              placeholder="Type a git command or search by description..." 
              value={searchValue}
              onValueChange={setSearchValue}
              className="text-gray-100 border-b border-gray-800"
            />
            <CommandList className="text-gray-100 scrollbar-hide max-h-[400px] p-2">
              <CommandEmpty className="text-gray-400 p-4 text-center">
                No Git commands found.
              </CommandEmpty>
              {filteredCommands.map((section) => (
                <CommandGroup key={section.title} heading={section.title} className="text-gray-400">
                  {section.commands.map((command) => (
                    <CommandItem
                      key={command.code}
                      value={command.code}
                      onSelect={() => {
                        setOpen(false)
                        setSearchValue(command.code)
                      }}
                      className="text-gray-100 hover:bg-gray-800/60 rounded-lg my-1 cursor-pointer"
                    >
                      <Terminal className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="font-mono">{command.code}</span>
                      <span className="ml-2 text-gray-400">
                        {command.description}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </CommandDialog>

        {/* Command Sandbox with Card */}
        <Card className="bg-gray-900 border-gray-800 mb-12">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Command Sandbox
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleCommandSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a Git command..."
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-gray-100"
              />
              <Button type="submit" variant="secondary">
                Run
              </Button>
            </form>
            {commandOutput.length > 0 && (
              <div className="mt-4">
                <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-100 overflow-x-auto">
                  {commandOutput.join("\n")}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Updated Cheat Sheet Sections */}
        <div className="space-y-6">
          {filteredCommands.map((section) => (
            <div key={section.title} className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                  {section.commands.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {section.commands.map((command) => (
                  <div
                    key={command.code}
                    className="group bg-gradient-to-br from-gray-900 to-gray-800/50 p-4 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <code className="font-mono text-sm bg-black/30 px-3 py-1.5 rounded-lg flex-1 overflow-x-auto scrollbar-hide">
                        {command.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(command.code)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-800/50"
                      >
                        {copiedCommand === command.code ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400 hover:text-gray-100" />
                        )}
                      </Button>
                    </div>
                    <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                      {command.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Separator */}
        <Separator className="my-8 bg-gray-800" />
        <footer className="text-center text-sm text-gray-400 pb-8">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> by Yasharth Singh from{" "}
            <a
              href="https://cicr.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline"
            >
              CICR
            </a>
            -The Robotics Club of JIIT-128
          </p>
        </footer>
      </div>
    </div>
  );
}

