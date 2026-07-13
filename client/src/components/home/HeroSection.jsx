import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-fade';

const slides = [
  {
    title: 'Turn your idea into momentum',
    subtitle: 'Launch a campaign in minutes and let a community of backers help you cross the finish line.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80',
    cta: { label: 'Start a Campaign', to: '/register' },
  },
  {
    title: 'Back projects you actually believe in',
    subtitle: 'Every credit you contribute goes toward real creators building real things — no middlemen.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=80',
    cta: { label: 'Explore Campaigns', to: '/explore-campaigns' },
  },
  {
    title: 'Transparent, credit-based funding',
    subtitle: 'Contributions stay in escrow until creators confirm delivery, so backers always stay protected.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80',
    cta: { label: 'Learn How It Works', to: '#how-it-works' },
  },
];

export const HeroSection = () => (
  <Swiper
    modules={[Autoplay, EffectFade]}
    effect="fade"
    autoplay={{ delay: 5500, disableOnInteraction: false }}
    loop
    className="h-[70vh] min-h-[420px] w-full"
  >
    {slides.map((slide) => (
      <SwiperSlide key={slide.title}>
        <div
          className="relative flex h-full w-full items-center bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-gray-900/55" />
          <div className="relative mx-auto max-w-3xl px-4 text-center text-white sm:px-6">
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{slide.title}</h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-100 sm:text-lg">{slide.subtitle}</p>
            <Link
              to={slide.cta.to}
              className="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-brand-500"
            >
              {slide.cta.label}
            </Link>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);
