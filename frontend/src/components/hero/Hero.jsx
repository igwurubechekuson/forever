import { assets } from "../../assets/frontend_assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      
      {/* LEFT SIDE */}
      <div className="flex-1 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141] flex flex-col items-center sm:items-start text-center sm:text-left">
          
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p>OUR BESTSELLERS</p>
          </div>

          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>

          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1">
        <img
          className="w-full h-full object-cover"
          src={assets.hero_img}
          alt=""
        />
      </div>

    </div>
  );
};

export default Hero;