const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-3 items-center mb-3">
      
      <p className="flex gap-2 text-gray-500 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        <span>{text1}</span>
        <span className="text-gray-700">{text2}</span>
      </p>

      <p className="w-10 md:w-14 h-[2px] bg-[#414141]"></p>

    </div>
  );
};

export default Title;