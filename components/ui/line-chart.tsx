"use client";
import { formatDate, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
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
      const dateString = formatDate(date, "yyyy-MM-dd");

      const likeCount = likes.filter((like) => isSameDay(like.timestamp, date)).length;
      const viewCount = views.filter((view) => isSameDay(view.timestamp, date)).length;
      const bookmarkCount = bookmarks.filter((bookmark) =>
        isSameDay(bookmark.timestamp, date)
      ).length;

      return {
        date: dateString,
        likes: likeCount,
        views: viewCount,
        favorites: bookmarkCount,
      };
    });

    setData(dateData);
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={250}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="likes" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="favorites" stroke="#82ca9d" />
        <Line type="monotone" dataKey="views" stroke="#828888" />
      </LineChart>
    </ResponsiveContainer>
  );
}
