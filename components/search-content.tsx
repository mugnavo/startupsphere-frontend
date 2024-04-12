"use client";
import { Search, X } from "lucide-react";
import { useState } from "react";

export default function SearchContent(props: { onClick: () => void }) {
  const [categories, setCategories] = useState([
    { id: 1, name: "cars", isActive: false },
    { id: 2, name: "people", isActive: false },
    { id: 3, name: "finance", isActive: false },
    { id: 4, name: "crypto", isActive: false },
    { id: 5, name: "goats", isActive: false },
    { id: 6, name: "stocks", isActive: false },
  ]);

  const filterSelected = (index: number) => {
    const updatedItems = [...categories];
    const itemToMove = updatedItems.splice(index, 1)[0]; // Remove item at index and store it

    if (!itemToMove.isActive) {
      updatedItems.unshift({ ...itemToMove, isActive: true }); // Add the removed item to the beginning with isActive set to true
      setCategories(updatedItems);
    }
  };

  const filterDeselected = (index: number) => {
    const updatedItems = [...categories];
    const itemToMove = updatedItems.splice(index, 1)[0]; // Remove item at index and store it

    const activeCategories = categories.filter((category) => category.isActive);

    updatedItems.splice(activeCategories.length - 1, 0, {
      ...itemToMove,
      isActive: false,
    }); // Add the removed item to the beginning with isActive set to true
    setCategories(updatedItems);
  };

  return (
    <div className=" absolute left-20 top-0 z-10 h-screen w-[22rem] bg-white p-6">
      <div className=" flex items-center justify-between">
        <span>Search</span>
        <X size={20} onClick={props.onClick} className="cursor-pointer" />
      </div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <Search size={15} className="  text-gray-500" />
        </div>
        <input
          type="search"
          name="search-startup"
          id="search-startup"
          className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Search Startups"
        />
      </div>
      <div className="scrollbar flex gap-3 overflow-x-scroll">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => filterSelected(index)}
            type="button"
            className={`flex items-center gap-3 ${category.isActive ? "btn-active" : "btn-primary"}`}
          >
            {category.name}
            {category.isActive && <X size={15} onClick={() => filterDeselected(index)} />}
          </button>
        ))}
      </div>
    </div>
  );
}
