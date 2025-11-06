import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Check Your Email
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                We&apos;ve sent you a confirmation email. Please check your inbox and click the link to verify your
                account.
              </p>

              <div className="flex items-gap-2 rounded-md bg-amber-50 dark:bg-amber-950 p-4">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300 ml-2">
                  If you don&apos;t see the email, check your spam folder or try signing in.
                </p>
              </div>

              <Link href="/auth/login">
                <Button className="w-full" size="lg">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
