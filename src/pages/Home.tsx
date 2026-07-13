import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import Hero from '../components/Hero';
import ActionCards from '../components/ActionCards';
import PetGrid from '../components/PetGrid';
import About from '../components/About';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="font-sans bg-white selection:bg-guapi-orange selection:text-white">
      <Header />
      <main>
        <BannerCarousel />
        <Hero />
        <ActionCards />
        <PetGrid />
        <About />
      </main>
      <Footer />
    </div>
  );
}
