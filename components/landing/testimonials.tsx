const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Computer Science Professor",
    text: "The code block feature is a game-changer. My students can now see properly formatted C# and Python examples right in the test interface.",
  },
  {
    name: "James Walker",
    role: "High School CS Teacher",
    text: "I love the point-based grading. Being able to assign different weights to questions and set custom grade thresholds gives me full control.",
  },
  {
    name: "Priya Patel",
    role: "Programming Instructor",
    text: "Setting up a test takes minutes. The image support lets me include diagrams for algorithm questions — exactly what I needed.",
  },
  {
    name: "Mark Thompson",
    role: "IT Department Head",
    text: "Students don't need accounts to take tests. They just enter a code and their name. Zero friction, and the results are available instantly.",
  },
  {
    name: "Elena Rodriguez",
    role: "Online Course Creator",
    text: "The dark theme sync with Clerk authentication makes the whole experience feel premium. My students actually enjoy taking tests here.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-b py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by educators
          </h2>
          <p className="mt-3 text-muted-foreground">
            Hear from teachers who use testche every day.
          </p>
        </div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="mb-6 break-inside-avoid rounded-xl border bg-card p-6 transition-shadow hover:shadow-sm"
            >
              <div className="mb-4 flex items-center gap-1 text-scooter-500 dark:text-scooter-400">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
