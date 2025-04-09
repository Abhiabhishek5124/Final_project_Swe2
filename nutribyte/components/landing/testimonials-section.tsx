import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Hear from Our Users</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See how Nutribyte has helped people achieve their fitness and nutrition goals.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage alt="User avatar" src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">John Doe</CardTitle>
                  <CardDescription>Lost 15kg in 6 months</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "Nutribyte's personalized approach made all the difference. The meal plans were easy to follow and the
                workouts were challenging but doable."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage alt="User avatar" src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Jane Smith</CardTitle>
                  <CardDescription>Gained muscle definition</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "As a vegetarian, I was worried about getting enough protein. Nutribyte created a perfect plan that
                helped me build muscle while respecting my dietary choices."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage alt="User avatar" src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Robert Johnson</CardTitle>
                  <CardDescription>Improved marathon time</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "The nutrition plan gave me the energy I needed for my training. I shaved 15 minutes off my marathon
                time after just 3 months!"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
