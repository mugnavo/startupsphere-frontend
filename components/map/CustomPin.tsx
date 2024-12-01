import { placeholderImageUrl } from "~/lib/utils";

export default function CustomPin({
  categories,
  avatar_url,
  startupname,
  ...props
}: {
  categories?: string[];
  avatar_url?: string;
  startupname?: string;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-items-center">
      <div
        className="transition-transform duration-700 group-hover:scale-[2.5]"
        style={{ transformOrigin: "bottom" }}
      >
        <div className="hidden min-w-14 flex-col items-center gap-0.5 rounded-sm bg-white p-1.5 pt-4 shadow-lg group-hover:flex">
          <img
            src={avatar_url || placeholderImageUrl}
            alt="Custom Pin"
            className="absolute left-1/2 top-[-15px] h-6 w-6 -translate-x-1/2 transform rounded-full"
          />
          <span className="text-[6px] font-semibold leading-none text-black">{startupname}</span>
          <div className="flex w-full flex-wrap items-center justify-center gap-[1px]">
            {categories?.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="rounded-md bg-gray-100 p-1 text-[5px] leading-none text-black shadow-md"
              >
                {category}
              </span>
            ))}
            {(categories?.length ?? 0) > 3 && (
              <span className="rounded-md bg-gray-100 p-1 text-[5px] leading-none text-black shadow-md">
                ...
              </span>
            )}
          </div>
        </div>
        <div className="block group-hover:hidden">
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
          </svg>
        </div>
      </div>
    </div>
  );
}
