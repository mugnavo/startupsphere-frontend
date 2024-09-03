"use client";
import { format, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Bookmark, Like, View } from "~/lib/schemas";

interface ChartData {
  date: string;
  likes: number;
  views: number;
  favorites: number;
}

export default function Chart({
  likes,
  views,
  bookmarks,
}: {
  likes: Like[];
  views: View[];
  bookmarks: Bookmark[];
}) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    getChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likes, views, bookmarks]);

  function getChartData() {
    // 14 days ago, to today
    const dates = [];
    for (let i = -14; i < 1; i++) {
      dates.push(new Date(new Date().setDate(new Date().getDate() + i)));
    }

    const dateData = dates.map((date) => {
      const dateString = format(date, "dd");

      const likeCount = likes.filter((like) => isSameDay(like.timestamp, date)).length;
      const viewCount = views.filter((view) => isSameDay(view.timestamp, date)).length;
      const bookmarkCount = bookmarks.filter((bookmark) =>
        isSameDay(bookmark.timestamp, date)
      ).length;

      return {
        date: dateString,
        views: viewCount,
        likes: likeCount,
        favorites: bookmarkCount,
      };
    });

    setData(dateData);
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={200}
        data={data}
        margin={{
          top: 5,
          left: -35,
          bottom: 5,
        }}
        className=" bg-[#fcfcfc]"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />

        <Line type="monotone" dataKey="views" stroke="#dc2626" />
        <Line type="monotone" dataKey="likes" stroke="#fb923c" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="favorites" stroke="#fde047" />
      </LineChart>
    </ResponsiveContainer>
  );
}
