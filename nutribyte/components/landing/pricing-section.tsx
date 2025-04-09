import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that works best for your fitness journey.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Basic features to get you started</CardDescription>
              <div className="mt-4 text-4xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">Forever free</p>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Basic nutrition plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Simple workout routines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Limited plan updates</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/signup" className="w-full">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="border-primary">
            <CardHeader>
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Popular
              </div>
              <CardTitle className="mt-4">Premium</CardTitle>
              <CardDescription>Everything you need for serious results</CardDescription>
              <div className="mt-4 text-4xl font-bold">$9.99</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Advanced personalized nutrition plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Detailed workout programs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Unlimited plan updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Progress tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Recipe database access</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/signup" className="w-full">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For those who want maximum results</CardDescription>
              <div className="mt-4 text-4xl font-bold">$19.99</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Everything in Premium</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">1-on-1 coaching sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Custom exercise library</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/signup" className="w-full">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
