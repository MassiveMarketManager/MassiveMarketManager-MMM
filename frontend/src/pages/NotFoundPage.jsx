import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Link 
        to="/" 
        className="text-blue-600 underline"
      >
        Back to Home
      </Link>
    </div>
  )
}
