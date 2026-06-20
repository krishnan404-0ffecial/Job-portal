const people = [
  {
    name: 'Elena Rostova',
    role: 'Founder & CEO',
    imageUrl:
      'https://ui-avatars.com/api/?name=Elena+Rostova&background=0f172a&color=fff&size=256&font-size=0.4&bold=true',
  },
  {
    name: 'David Vance',
    role: 'Chief Technology Officer',
    imageUrl:
      'https://ui-avatars.com/api/?name=David+Vance&background=3b82f6&color=fff&size=256&font-size=0.4&bold=true',
  },
  {
    name: 'Sophia Patel',
    role: 'Head of Talent Acquisition',
    imageUrl:
      'https://ui-avatars.com/api/?name=Sophia+Patel&background=10b981&color=fff&size=256&font-size=0.4&bold=true',
  },
  {
    name: 'Marcus Chen',
    role: 'Lead Career Coach & Mentor',
    imageUrl:
      'https://ui-avatars.com/api/?name=Marcus+Chen&background=f59e0b&color=fff&size=256&font-size=0.4&bold=true',
  },
  {
    name: 'Clara Dupont',
    role: 'Director of Partner Relations',
    imageUrl:
      'https://ui-avatars.com/api/?name=Clara+Dupont&background=8b5cf6&color=fff&size=256&font-size=0.4&bold=true',
  },
  {
    name: 'Vikram Malhotra',
    role: 'Lead AI Engineer',
    imageUrl:
      'https://ui-avatars.com/api/?name=Vikram+Malhotra&background=ec4899&color=fff&size=256&font-size=0.4&bold=true',
  },
]

export default function Team() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet our Leadership & Mentors</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our board consists of world-class technology executives, recruiters, and career mentors dedicated to bridging the gap between talented candidates and fast-growing global companies.
          </p>
        </div>
        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
          {people.map((person) => (
            <li key={person.name}>
              <div className="flex items-center gap-x-6">
                <img className="h-16 w-16 rounded-full" src={person.imageUrl} alt={person.name} />
                <div>
                  <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                  <p className="text-sm font-semibold leading-6 text-indigo-600">{person.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
