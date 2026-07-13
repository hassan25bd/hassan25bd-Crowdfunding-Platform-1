import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Maria Gonzalez',
    role: 'Supporter · backed 8 campaigns',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
    quote:
      "I love that my credits sit in escrow until the creator actually delivers an update. I've backed eight campaigns here and never once felt like my contribution disappeared into a black hole.",
  },
  {
    name: 'David Okafor',
    role: 'Creator · Mobile Health Clinic Van',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    quote:
      'CrowdNest made it simple to get our clinic van funded. The withdrawal process was transparent, and our backers could see exactly how close we were to the goal at every step.',
  },
  {
    name: 'Priya Sharma',
    role: 'Supporter · backed 14 campaigns',
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces',
    quote:
      "The notification system is what keeps me coming back — I get pinged the moment a campaign I've supported posts an update or a creator approves my contribution.",
  },
  {
    name: 'Tomas Novak',
    role: 'Creator · Neighborhood Library Renovation',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces',
    quote:
      'We hit our funding goal in three weeks. Being able to review and approve each contribution individually meant we could thank every single supporter personally.',
  },
];

export const TestimonialsSection = () => (
  <section className="bg-gray-50 py-16">
    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">What our community says</h2>
      <p className="mt-2 text-gray-500">Real feedback from supporters and creators using the platform.</p>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="mt-10 pb-12"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.name}>
            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <img
                src={t.photo}
                alt={t.name}
                className="mx-auto h-16 w-16 rounded-full object-cover"
              />
              <p className="mt-4 text-lg italic text-gray-600">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-semibold text-gray-800">{t.name}</p>
              <p className="text-sm text-gray-400">{t.role}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);
