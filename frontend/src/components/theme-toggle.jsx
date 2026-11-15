
import { useTheme } from "@/components/theme-provider"
import { Sun, Moon } from "lucide-react"
export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("light")
    else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(systemDark ? "light" : "dark")
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-muted-foreground/20 transition-colors hover:bg-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`${
          theme === "dark" ? "translate-x-7" : "translate-x-1"
        } inline-block h-6 w-6 transform rounded-full bg-background shadow-lg transition-transform duration-200 ease-in-out`}
      />
      {/* Icons */}
      <Sun className="absolute left-1.5 h-4 w-4 text-muted-foreground/70" />
      <Moon className="absolute right-1.5 h-4 w-4 text-muted-foreground/70" />
    </button>
  )

}