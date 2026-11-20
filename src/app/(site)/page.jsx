import { Hero } from '@/components/home/hero';
import { FeaturedItems } from '@/components/home/featured-items';
import { Categories } from '@/components/home/categories';
import { WhyChoose } from '@/components/home/why-choose';
import { HowItWorks } from '@/components/home/how-it-works';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedItems />
      <Categories />
      <WhyChoose />
      <HowItWorks />
    </>
  );
}
