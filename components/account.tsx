import { LogOut, UserRoundX } from "lucide-react";
import { useState } from "react";

export default function Account() {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const handleAccountClick = () => {
    setIsShowMenu(!isShowMenu);
  };
  return (
    <>
      <div
        onClick={() => handleAccountClick()}
        className="absolute right-3 top-3 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-yellow-400 bg-red-900 text-xl font-normal text-white"
      >
        J
      </div>
      {isShowMenu && <AccountMenu />}
    </>
  );
}

function AccountMenu() {
  const menuItems = [
    { id: 1, name: "delete account", icon: UserRoundX },
    { id: 2, name: "log out", icon: LogOut },
  ];
  return (
    <div className="absolute right-3 top-14 z-50 flex h-auto w-48 flex-col gap-1 rounded bg-white p-2 text-sm">
      {menuItems.map((item, index) => (
        <div
          key={item.id}
          className=" flex cursor-pointer items-center gap-2 rounded p-3 hover:bg-gray-100"
        >
          <item.icon size={15} />
          {item.name}
        </div>
      ))}
      <div className="m-auto mt-1 block w-3 rounded-lg border border-gray-300" />
      <div className="m-2 cursor-pointer rounded-full bg-red-700 p-2 text-center font-bold hover:bg-red-500">
        Add Account
      </div>
    </div>
  );
}
