import { Activity, Apple, Calendar, Clock, Dumbbell, Salad } from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Everything You Need for Your Fitness Journey
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nutribyte combines AI-powered personalization with proven fitness and nutrition science to help you
              achieve your goals.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Dumbbell className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Personalized Workouts</h3>
            <p className="text-center text-muted-foreground">
              Custom workout plans based on your goals, experience level, and available equipment.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Salad className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Nutrition Planning</h3>
            <p className="text-center text-muted-foreground">
              Tailored meal plans that fit your dietary preferences and support your fitness goals.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Progress Tracking</h3>
            <p className="text-center text-muted-foreground">
              Monitor your progress with easy-to-use tracking tools and visualizations.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Apple className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Dietary Flexibility</h3>
            <p className="text-center text-muted-foreground">
              Support for various dietary preferences including vegetarian, vegan, keto, and more.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Adaptive Planning</h3>
            <p className="text-center text-muted-foreground">
              Plans that adapt to your progress, schedule changes, and evolving goals.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Time-Efficient</h3>
            <p className="text-center text-muted-foreground">
              Workouts and meal plans designed to fit your busy schedule and time constraints.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
