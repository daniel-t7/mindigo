export function Clients() {
  const schools = [
    "Springfield High",
    "Riverside Academy",
    "Tech Valley College",
    "Brighton Institute",
    "Summit University",
    "Oakwood Prep",
    "Metro State",
    "Crestwood School",
  ];

  return (
    <section className="border-b py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by educators at
        </p>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-12">
            {[...schools, ...schools].map((name, i) => (
              <div
                key={i}
                className="flex h-10 items-center whitespace-nowrap rounded-lg border bg-card px-5 text-sm font-medium text-muted-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
