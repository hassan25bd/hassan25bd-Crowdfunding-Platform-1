import { HeroSection } from '../components/home/HeroSection';
import { TopFundedSection } from '../components/home/TopFundedSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { ImpactSection } from '../components/home/ImpactSection';

export const Home = () => (
  <div>
    <HeroSection />
    <TopFundedSection />
    <HowItWorksSection />
    <CategoriesSection />
    <TestimonialsSection />
    <ImpactSection />
  </div>
);
