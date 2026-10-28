import BestSeller from "../../components/best-seller/BestSeller";
import Hero from "../../components/hero/Hero";
import LatestCollection from "../../components/latest-collection/LatestCollection";
import NewsLetter from "../../components/newsletter/NewsLetter";
import OurPolicy from "../../components/our-policy/OurPolicy";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetter />
    </div>
  );
};

export default Home;
