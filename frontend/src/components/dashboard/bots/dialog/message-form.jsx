
import { Button } from "@/components/ui/button"

export function MessageForm({ onSubmit, onCancel, text,submitButtonText }) {

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {text}
      </p>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="destructive">
          {submitButtonText}
        </Button>
      </div>
    </form>
  )
}
