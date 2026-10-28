import { assets } from "../../assets/frontend_assets/assets";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const linkSections = [
    {
      title: "COMPANY",
      links: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "FAQs", path: "/faqs" },
      ],
    },
    {
      title: "NEED HELP?",
      links: [
         { name: "Contact Us", path: "/contact" },
        { name: "Delivery Information", path: "/delivery-information" },
        { name: "Return & Refund Policy", path: "/returns" },
      ],
    },
    {
      title: "FOLLOW US",
      links: [
        { name: "Instagram", path: "https://instagram.com" },
        { name: "Twitter", path: "https://twitter.com" },
        { name: "Facebook", path: "https://facebook.com" },
        { name: "YouTube", path: "https://youtube.com" },
      ],
    },
  ];

  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-12 border-b border-gray-300">
        <div className="max-w-md">
          <img
            className="w-32"
            src={assets.logo}
            alt="Forever logo"
          />
          <p className="mt-6 text-sm md:text-base leading-6 text-gray-500">
            Discover timeless fashion, quality essentials, and everyday styles
            designed to keep you confident and comfortable wherever you go.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-[55%]">
          {linkSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 mb-4">
                {section.title}
              </h3>

              <ul className="space-y-3 text-sm text-gray-500">
                {section.links.map((link, i) => {
                  const isExternal = link.path.startsWith("http");

                  return (
                    <li key={i}>
                      {isExternal ? (
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center relative transition duration-300 hover:text-black"
                        >
                          <span>{link.name}</span>
                          <span className="absolute left-0 -bottom-1 h-[1.5px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                        </a>
                      ) : (
                        <NavLink
                          to={link.path}
                          className={({ isActive }) =>
                            `group inline-flex items-center relative transition duration-300 ${
                              isActive
                                ? "text-black font-medium"
                                : "text-gray-500 hover:text-black"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span>{link.name}</span>
                              <span
                                className={`absolute left-0 -bottom-1 h-[1.5px] bg-black transition-all duration-300 ${
                                  isActive
                                    ? "w-full"
                                    : "w-0 group-hover:w-full"
                                }`}
                              ></span>
                            </>
                          )}
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="py-5 text-center text-sm md:text-base text-gray-500">
        Copyright 2025 © Forever. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;