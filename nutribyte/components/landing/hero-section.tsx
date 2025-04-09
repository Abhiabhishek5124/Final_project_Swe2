import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Personalized Nutrition & Fitness Journey
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Nutribyte uses AI to create personalized nutrition and workout plans tailored to your unique goals,
                preferences, and lifestyle.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full">
                  Get Started
                </Button>
              </Link>
              <Link href="/#features">
                <Button size="lg" variant="outline" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[450px] w-[350px] rounded-xl bg-muted/50 sm:w-[400px]">
              <Image
                src="/hero-image.png"
                alt="Hero Image"
                fill
                className="object-cover rounded-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
