import { motion } from "framer-motion";
import { useState } from "react";

export default function CustomPin({
  startupimage,
  categories,
  startupname,
  ...props
}: { categories?: string[] } & { startupname?: string } & {
  startupimage?: string;
} & React.SVGProps<SVGSVGElement>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center justify-items-center">
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
          scale: 2.5,
          transformOrigin: "bottom",
          transition: { type: "spring", stiffness: 100, damping: 15 },
        }}
        whileTap={{ scale: 1 }}
      >
        {isHovered ? (
          <div className="flex h-12 w-[112px] min-w-0 flex-col items-center justify-center rounded-sm bg-white p-3 drop-shadow-lg">
            <img
              src={startupimage}
              alt="Custom Pin"
              className="absolute left-1/2 top-[-15px] h-6 w-6 -translate-x-1/2 transform rounded-full"
            />
            <div className="h-6 min-w-0 text-[7px] font-semibold text-black">{startupname}</div>
            <div className="flex h-[64px] w-full flex-wrap items-center justify-center gap-[1px]">
              {categories?.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="flex h-[8px] w-auto flex-row items-center rounded-md bg-gray-100 p-1 text-[4px] text-black drop-shadow-md"
                >
                  {category}
                </span>
              ))}
              {(categories?.length ?? 0) > 3 && (
                <span className="flex h-[8px] w-auto flex-row items-center rounded-md bg-gray-100 p-1 text-[4px] text-black drop-shadow-md">
                  ...
                </span>
              )}
            </div>
          </div>
        ) : (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              {...props}
            >
              <defs>
                <clipPath id="circleView">
                  <circle cx="12" cy="11" r="6" />
                </clipPath>
              </defs>
              <path
                fillRule="evenodd"
                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
              <foreignObject x="6" y="5" width="12" height="12" clipPath="url(#circleView)">
                <div className="absolute top-0 flex h-full w-full items-center justify-center bg-white rounded-full">
                  <img src={startupimage} alt="Custom Pin" className="h-full w-full rounded-full" />
                </div>
              </foreignObject>
            </svg>
          </div>
        )}
      </motion.div>
    </div>
  );
}
