"use client";
import { Image, MapPin, Globe, ThumbsUp, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StartupDetails {
  name: string;
  address: string;
  website: string;
  industry: string;
  founder: string;
  contactInfo: string;
  foundedDate: string;
  fundingStage: string;
}

export default function StartupDetails() {
  const router = useRouter();
  const [startupDetails, setStartupDetails] = useState<StartupDetails>({
    name: "Startup Name Inc.",
    address: "Cebu City, Philippines",
    website: "www.startup.com",
    industry: "Lifestyle & Entertainment",
    founder: "Founder Name",
    contactInfo: "startupname@gmail.com",
    foundedDate: "Mar 2023",
    fundingStage: "hmm",
  });

  const startupDescription = () => {
    return "Startup Name Inc. is a leading company in the lifestyle and entertainment industry, specializing in innovative solutions for adventurous individuals. From immersive storytelling experiences to cutting-edge digital entertainment, Startup Name Inc. is committed to pushing the boundaries of creativity and imagination. With a team of passionate creators and visionaries, Startup Name Inc. continues to captivate audiences worldwide.";
  };

  const handleSaveToFavorites = () => {
    console.log("Saved to favorites");
  };
  const handleLike = () => {
    console.log("Liked!");
  };
  return (
    <div
      className="absolute left-20 top-0 z-10 h-screen w-[22rem] overflow-y-auto bg-white p-6"
      style={{ padding: 0, margin: 0 }}
    >
      <div className="flex flex-grow items-center justify-center">
        <div className="flex h-64 w-full items-center justify-center bg-gray-200">
          <Image size={128} color="#6B7280" />
        </div>
      </div>
      <div className="border-t border-gray-200 py-4">
        <div className="flex items-center justify-between px-6">
          <span className="text-lg font-bold">{startupDetails.name}</span>

          <ThumbsUp size={24} onClick={handleLike} className="cursor-pointer" />
        </div>
        <div className="flex items-center px-6 py-1">
          <MapPin size={16} />
          <span className="ml-2 text-sm">{startupDetails.address}</span>
        </div>
        <div className="flex items-center px-6 py-1">
          <Globe size={16} />
          <span className="ml-2  text-sm">{startupDetails.website}</span>
        </div>
        <div className="flex justify-center py-4">
          <div
            className="flex cursor-pointer justify-center py-4"
            onClick={handleSaveToFavorites}
          >
            <Bookmark size={18} />
            <span className="ml-1 text-sm underline">Save to favorites</span>
          </div>
        </div>
        <hr className="border-gray-200" />
      </div>
      <div className="flex-grow overflow-y-auto px-6 py-4">
        <div className="mb-1 font-bold">{startupDetails.founder}</div>
        <div className="mb-4 text-sm text-gray-300">Founder</div>
        <div className="mb-1 font-bold">{startupDetails.foundedDate}</div>
        <div className="mb-4 text-sm text-gray-300">Established</div>
        <div className="mb-4 text-gray-600">{startupDescription()}</div>
        <hr className="mb-4 border-gray-200" />
        <div className="text-gray-600">
          <div className="mb-2">
            <p className="font-bold">Industry:</p> {startupDetails.industry}
          </div>
          <div className="mb-2">
            <p className="font-bold">Contact Info:</p> {startupDetails.contactInfo}
          </div>
          <div className="mb-2">
            <p className="font-bold">Founded Date:</p> {startupDetails.foundedDate}
          </div>
          <div className="mb-2">
            <p className="font-bold">Funding Stage:</p> {startupDetails.fundingStage}
          </div>
        </div>
      </div>
    </div>
  );
}
