"use client";
import { ArrowLeft, Cog, Filter, HandCoins, Search, SquareMousePointer, X } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useEcosystem, useSession } from "~/context/hooks";
import { reportControllerCreate } from "~/lib/api";
import { Startup } from "~/lib/schemas";
import { Investor } from "~/lib/schemas/investor";
import { investorTypes, placeholderImageUrl, sectors, withAuth } from "~/lib/utils";

export default function SearchContent() {
  const router = useRouter();
  const { user } = useSession();

  const { startups, investors, profilePictures } = useEcosystem();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchFocus, setSearchFocus] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const searchFocusType = [
    { name: "Startups", icon: <Cog size={24} /> },
    { name: "Investors", icon: <HandCoins size={24} /> },
  ];
  const [categories, setCategories] = useState(
    sectors.concat(investorTypes).map((category, index) => ({
      id: index + 1,
      name: category,
      isActive: false,
      type: index < sectors.length ? "Startups" : "Investors",
    }))
  );

  useEffect(() => {
    if (startups.length > 0 || investors.length > 0) {
      setLoading(false);
    }
  }, [startups, investors]);

  const filteredStartups = startups.filter(
    (startup) =>
      (searchQuery === "" ||
        startup.companyName.toLowerCase().includes(searchQuery.toLowerCase())) && // check if searchquery is empty to show startups
      (categories.every((category) => !category.isActive) || // check if no category is selected to show all startups
        categories
          .filter((category) => category.isActive)
          .some((activeCategory) => startup?.industry === activeCategory.name))
  );

  const filteredInvestors = investors.filter(
    (investor) =>
      searchQuery === "" ||
      investor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function filterSelected(index: number) {
    const updatedItems = [...categories];
    const itemToMove = updatedItems.splice(index, 1)[0]; // Remove item at index and store it
    if (!itemToMove.isActive) {
      updatedItems.unshift({ ...itemToMove, isActive: true }); // Add the removed item to the beginning with isActive set to true
      setCategories(updatedItems);
    }
  }

  function filterDeselected(index: number) {
    const updatedItems = [...categories];
    const itemToMove = updatedItems.splice(index, 1)[0]; // Remove item at index and store it
    const activeCategories = categories.filter((category) => category.isActive);
    updatedItems.splice(activeCategories.length - 1, 0, {
      ...itemToMove,
      isActive: false,
    }); // Add the removed item to the beginning with isActive set to true
    setCategories(updatedItems);
  }

  const generateCSV = () => {
    const headers = ["Name", "Location", "Categories"];
    const rows = filteredStartups.map((startup) => [
      startup.companyName,
      `"${startup.locationName}"`,
      `"${startup.industry}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return {
      blob: new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      content: csvContent,
    };
  };

  const handleGenerateReports = async () => {
    setLoading(true);
    try {
      const now = new Date();

      // Extract date components
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(now.getDate()).padStart(2, "0");

      // Extract time components
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const activeCategories = categories
        .filter((category) => category.isActive)
        .map((category) => category.name)
        .join("_");

      const filename = searchFocus
        ? `${searchFocus}_${year}${month}${day}${hours}${minutes}${activeCategories ? `-${activeCategories}` : ""}`
        : `StartupSphere_${year}${month}${day}-${hours}${minutes}`;

      const { blob, content } = generateCSV();
      const file = new File([blob], `${filename}.csv`, { type: "text/csv" });

      //download chuchu
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const reportRequest = {
        generated_by: user?.id as number,
        name: filename,
        content: content,
      };

      await reportControllerCreate(reportRequest, withAuth);
    } catch (error) {
      console.error("Error generating reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col bg-[#fefefe] p-6 pb-3 shadow-sm shadow-slate-200">
      {/* the gradient div */}
      <div className="absolute inset-0 z-[-10] h-[9.5rem] bg-gradient-to-b from-[#004A98] to-transparent opacity-80" />
      {user ? (
        <motion.div
          onHoverStart={() => setIsHovered(true)} // Set hover state to true when mouse enters the area
          onHoverEnd={() => setIsHovered(false)} // Set hover state to false when mouse leaves the area
          className="absolute bottom-8 right-8 z-50" // Ensure absolute positioning at bottom-right
        >
          {/* Conditionally render based on hover state */}
          {isHovered ? (
            // Generate Reports Button
            <motion.button
              initial={{ opacity: 0, y: 10 }} // Set initial opacity and position for animation
              animate={{ opacity: 1, y: 0 }} // Animate to full opacity and neutral position
              exit={{ opacity: 0, y: -10 }} // Exit with fade-out and position change
              className="absolute bottom-0 right-0 z-50 rounded-full bg-[#004A98] px-6 py-2 text-white shadow-lg transition duration-300 ease-in-out hover:shadow-2xl"
              style={{ whiteSpace: "nowrap" }} // Prevent text wrapping inside the button
              onClick={handleGenerateReports}
            >
              Generate Reports
            </motion.button>
          ) : (
            // SquareMousePointer Icon
            <motion.div
              initial={{ opacity: 0, scale: 1.2 }} // Set initial opacity and scale for animation
              animate={{ opacity: 1, scale: 1 }} // Animate to full opacity and normal scale
              exit={{ opacity: 0, scale: 1 }} // Exit with fade-out and scale-down animation
              className="absolute bottom-0 right-0 z-50 rounded-full bg-white p-2 shadow-lg transition duration-300 ease-in-out"
            >
              <SquareMousePointer />
            </motion.div>
          )}
        </motion.div>
      ) : null}

      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-lg font-semibold">{searchFocus ? searchFocus : "Search"}</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="relative flex items-center gap-2 py-1">
        <div
          onClick={() => {
            setSearchFocus("");
            setShowFilters(false);
            setCategories((cat) =>
              cat.map((category) => ({
                ...category,
                isActive: false,
              }))
            );
          }}
          className="absolute inset-0 flex w-fit cursor-pointer items-center pl-2 text-gray-500"
        >
          {searchFocus ? <ArrowLeft size={15} /> : <Search size={15} />}
        </div>
        <input
          type="search"
          name="search-startup"
          id="search-startup"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-full border-0 py-2 pl-7 pr-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder={`Search ${searchFocus ? searchFocus : "Startups or Investors"}...`}
        />
        {searchFocus == "Startups" && (
          <Filter size={20} onClick={() => setShowFilters(!showFilters)} />
        )}
      </div>
      <div className={` ${!searchFocus ? "flex" : "hidden"}`}>
        {searchFocusType.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setSearchFocus(item.name)}
            type="button"
            className={`flex w-full items-center gap-3 bg-white px-3 py-1 text-gray-400 ring-1 ring-gray-300 hover:bg-gradient-to-r hover:font-bold hover:text-white ${index == 0 ? "rounded-l-full hover:from-[#FFC312] hover:via-[#EE5A24] hover:to-[#EA2027]" : "rounded-r-full hover:from-[#68d8d6] hover:via-[#00a6fb] hover:to-[#00509d]"}`}
            // className={`flex w-full items-center gap-3 bg-[rgb(192,57,43)] bg-gradient-to-b from-[rgba(234,179,8,0.8)] to-[rgba(202,138,4,0.8)] p-3 text-white hover:bg-gradient-to-r ${index == 0 ? "rounded-l-full hover:from-[#FFC312] hover:via-[#EE5A24] hover:to-[#EA2027]" : "rounded-r-full hover:from-[#68d8d6] hover:via-[#00a6fb] hover:to-[#00509d]"}`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </div>

      {/* filters */}
      <div
        className={`transition-max-height flex flex-wrap gap-3 overflow-hidden rounded-[16px] bg-slate-100 duration-300 ease-in-out ${showFilters ? "max-h-fit-content p-4" : "max-h-0 px-4"}`}
      >
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => filterSelected(index)}
            type="button"
            className={`${category.type == searchFocus ? "flex" : "hidden"} select-none items-center gap-3 ${category.isActive ? "btn-active" : "btn-primary"}`}
          >
            {category.name}
            {category.isActive && <X size={15} onClick={() => filterDeselected(index)} />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-scroll">
        <div className="relative mt-2 h-screen">
          <div className="mt-2 h-screen">
            {loading ? (
              <div className="mt-5 flex h-screen flex-col gap-8">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="flex w-[90%] flex-row items-center gap-2">
                        <div className="h-14 w-10 animate-pulse rounded-lg bg-base-300" />
                        <div className="h-14 w-[80%] animate-pulse rounded-lg bg-base-300" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : searchFocus ? (
              <Items
                list={searchFocus == "Startups" ? filteredStartups : filteredInvestors}
                profilePictures={profilePictures}
              />
            ) : (
              <>
                <Items list={filteredStartups} profilePictures={profilePictures} />
                <Items list={filteredInvestors} profilePictures={profilePictures} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Items({ list, profilePictures }: { list: Startup[] | Investor[]; profilePictures: any }) {
  const router = useRouter();
  return (
    <>
      {list.map((item) => {
        const isStartup = item.hasOwnProperty("companyName");
        return (
          <div
            key={item.id}
            className="mb-1 flex cursor-pointer items-center justify-between rounded-md bg-white p-2 shadow-none hover:bg-gray-100"
            onClick={() => router.push(`/${isStartup ? "startup" : "investor"}/${item.id}`)}
          >
            <div className="flex w-full items-center">
              <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                <img
                  src={
                    profilePictures[`${isStartup ? "startup" : "investor"}_${item.id}`] ||
                    placeholderImageUrl
                  }
                  alt={
                    isStartup
                      ? (item as Startup).companyName
                      : `${(item as Investor).firstName} ${(item as Investor).lastName}`
                  }
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <div className="text-sm font-semibold">
                    {isStartup
                      ? (item as Startup).companyName
                      : `${(item as Investor).firstName} ${(item as Investor).lastName}`}
                  </div>
                  <div className="text-xs text-gray-500">{item.locationName}</div>
                  {/* Set max width */}
                  <div className="mt-1 flex overflow-hidden">
                    <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs">
                      {isStartup ? (item as Startup).industry : "Investor"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
