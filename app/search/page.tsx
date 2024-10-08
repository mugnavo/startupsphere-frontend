"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Cog, Filter, HandCoins, Search, SquareMousePointer, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadFiles } from "~/components/uploadthing";
import { useSession } from "~/context/hooks";
import {
  investorControllerGetAll,
  reportControllerCreate,
  startupControllerGetAll,
} from "~/lib/api";
import { ReportRequest, Startup } from "~/lib/schemas";
import { Investor } from "~/lib/schemas/investor";
import { investorTypes, sectors, withAuth } from "~/lib/utils";

export default function SearchContent() {
  const router = useRouter();
  const { user } = useSession();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
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

  async function fetchInvestors() {
    const { data } = await investorControllerGetAll();
    if (data) {
      setInvestors(data);
    }
  }

  async function fetchStartups() {
    const { data } = await startupControllerGetAll();
    if (data) {
      setStartups(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchStartups();
    fetchInvestors();
  }, []);

  const filteredStartups = startups.filter(
    (startup) =>
      (searchQuery === "" || startup.name.toLowerCase().includes(searchQuery.toLowerCase())) && // check if searchquery is empty to show startups
      (categories.every((category) => !category.isActive) || // check if no category is selected to show all startups
        startup.categories.some((startupCategory) =>
          categories
            .filter((category) => category.isActive)
            .some((activeCategory) => startupCategory === activeCategory.name)
        ))
  );

  const filteredInvestors = investors.filter(
    (investor) =>
      (searchQuery === "" || investor.name.toLowerCase().includes(searchQuery.toLowerCase())) && // check if searchquery is empty to show startups
      (categories.every((category) => !category.isActive) || // check if no category is selected to show all startups
        [investor.type].some((investorType) =>
          categories
            .filter((category) => category.isActive)
            .some((activeCategory) => investorType === activeCategory.name)
        ))
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
      startup.name,
      `"${startup.locationName}"`,
      `"${startup.categories.join(", ")}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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

      // Construct the filename
      const filename = `${year}${month}${day}-Startups-${hours}${minutes}${seconds}.csv`;

      const csvBlob = generateCSV();
      const file = new File([csvBlob], filename, { type: "text/csv" });

      //download chuchu
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // post to reports
      const result = await uploadFiles("reportUploader", {
        files: [file],
      });

      const reportRequest: ReportRequest = {
        file_type: result[0].type,
        generated_by: user?.id as number,
        name: result[0].name,
        url: result[0].url,
      };

      await reportControllerCreate(reportRequest, withAuth);
    } catch (error) {
      console.error("Error generating reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col gap-1 bg-[#fefefe] p-5 pb-3 shadow-sm shadow-slate-400">
      {/* the gradient div */}
      <div className="absolute inset-0 z-[-10] h-[8rem] bg-gradient-to-b from-yellow-600 to-transparent opacity-80" />
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
            className="absolute bottom-0 right-0 z-50 rounded-full bg-red-900 px-6 py-2 text-white shadow-lg transition duration-300 ease-in-out hover:shadow-2xl"
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
      <div className="flex items-center justify-between">
        <span className="text-yellow-800">{searchFocus ? searchFocus : "Search"}</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="relative flex items-center gap-2">
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
          className="block w-full rounded-[16px] border-0 py-1.5 pl-7 pr-3 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder={`Search ${searchFocus ? searchFocus : "Startups or Investors"}...`}
        />
        {searchFocus && <Filter size={20} onClick={() => setShowFilters(!showFilters)} />}
      </div>

      <div className={` ${!searchFocus ? "flex" : "hidden"}`}>
        {searchFocusType.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setSearchFocus(item.name)}
            type="button"
            className={`flex w-full items-center gap-3 bg-white px-3 py-2 text-gray-400 ring-1 ring-gray-300 hover:bg-gradient-to-r hover:font-bold hover:text-white ${index == 0 ? "rounded-l-full hover:from-[#FFC312] hover:via-[#EE5A24] hover:to-[#EA2027]" : "rounded-r-full hover:from-[#68d8d6] hover:via-[#00a6fb] hover:to-[#00509d]"}`}
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
              <Items list={searchFocus == "Startups" ? filteredStartups : filteredInvestors} />
            ) : (
              <>
                <Items list={filteredStartups} />
                <Items list={filteredInvestors} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Items({ list }: { list: Startup[] | Investor[] }) {
  const router = useRouter();
  return (
    <>
      {list.map((item) => {
        const isStartup = item.hasOwnProperty("founderName");
        return (
          <div
            key={item.id}
            className="mb-1 flex cursor-pointer items-center justify-between rounded-md bg-white p-2 shadow-none hover:bg-gray-100"
            onClick={() => router.push(`/startup/${item.id}`)}
          >
            <div className="flex w-full items-center">
              <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-white">
                <img src={item.logoUrl} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="relative">
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="max-w-[200px] truncate text-xs text-gray-500">
                    {item.locationName}
                  </div>{" "}
                  {/* Set max width */}
                  <div className="mt-1 flex overflow-hidden whitespace-nowrap">
                    {(isStartup ? (item as Startup).categories : [(item as Investor).type])
                      .slice(0, 1)
                      .map((category: string, index: number) => (
                        <span
                          key={index}
                          className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    {isStartup && (item as Startup).categories.length > 1 && (
                      <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-500">
                        ...
                      </span>
                    )}
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
