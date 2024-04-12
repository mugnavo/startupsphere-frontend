"use client";
import { Heart, History, LineChart, Megaphone, Plus, Search } from "lucide-react";
import { useState } from "react";
import Favorites from "./favorites";
import SearchContent from "./search-content";

export default function SideMenu() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "search", icon: Search, isActive: false },
    { id: 2, name: "recents", icon: History, isActive: false },
    { id: 3, name: "favorites", icon: Heart, isActive: false },
    { id: 4, name: "analytics", icon: Megaphone, isActive: false },
    { id: 5, name: "MOD\nanalytics", icon: LineChart, isActive: false },
    { id: 6, name: "create", icon: Plus, isActive: false },
  ]);

  const handleItemClick = (itemName: string) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName
          ? { ...item, isActive: !item.isActive }
          : { ...item, isActive: false }
      )
    );
  };

  return (
    <>
      <div className=" absolute left-0 top-0 z-50 flex h-screen w-20 flex-col items-center gap-5 bg-white p-3 pt-16 align-middle shadow-lg shadow-slate-400">
        <Logo />

        {menuItems.map((item, index) => (
          <>
            <MenuItem
              key={index}
              state={item.isActive}
              name={item.name}
              icon={item.icon}
              onClick={() => handleItemClick(item.name)}
            />

            {index === 3 && <div className="m-2 w-3 rounded-lg border border-gray-300" />}
          </>
        ))}

        <div className=" absolute bottom-0 h-2 w-full bg-yellow-400" />
      </div>
      {menuItems[0].isActive && (
        <SearchContent onClick={() => handleItemClick(menuItems[0].name)} />
      )}
      {menuItems[2].isActive && (
        <Favorites onClick={() => handleItemClick("favoritesIsActive")} />
      )}
    </>
  );
}

function Logo() {
  return <div className="absolute top-0 h-12 w-full bg-red-900"></div>;
}

function MenuItem(props: {
  state: boolean;
  name: string;
  icon: React.ElementType | undefined;
  onClick: () => void;
}) {
  return (
    <div
      onClick={props.onClick}
      className={`${props.state ? " text-gray-900" : "text-gray-500"} flex cursor-pointer flex-col items-center text-center`}
    >
      {props.icon && <props.icon size={22} />}
      <div className={`${props.state ? "font-bold" : "font-light"} mt-1 text-xs`}>
        {props.name}
      </div>
    </div>
  );
}
