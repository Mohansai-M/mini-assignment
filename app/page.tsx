"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1>Search and Scrap</h1>

      <div className="">
        <button onClick={() => router.push("/Search")}>Go to Search</button>
        <button onClick={() => router.push("/Scrap")}>Go to Scrap</button>
      </div>
    </div>
  );
}
