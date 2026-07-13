const steps = [
  {
    number: '01',
    title: 'Create your account',
    description:
      'Register as a Supporter to start backing campaigns with 50 free credits, or as a Creator to launch your own with 20.',
  },
  {
    number: '02',
    title: 'Discover or launch a campaign',
    description:
      'Browse approved campaigns by category and deadline, or submit your own idea for admin review before it goes live.',
  },
  {
    number: '03',
    title: 'Fund and track progress',
    description:
      'Contribute credits toward campaigns you believe in. Creators approve each contribution, and funds move transparently.',
  },
  {
    number: '04',
    title: 'Creators withdraw, supporters get updates',
    description:
      'Once a campaign raises enough, creators can request a payout while supporters get notified every step of the way.',
  },
];

export const HowItWorksSection = () => (
  <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="mb-10 text-center">
      <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">How CrowdNest Works</h2>
      <p className="mt-2 text-gray-500">From idea to funded project in four simple steps.</p>
    </div>

    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step) => (
        <div key={step.number} className="rounded-2xl border border-gray-100 p-6">
          <span className="text-3xl font-bold text-brand-200">{step.number}</span>
          <h3 className="mt-3 font-semibold text-gray-800">{step.title}</h3>
          <p className="mt-2 text-sm text-gray-500">{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);
