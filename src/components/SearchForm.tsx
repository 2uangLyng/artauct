"use client";

import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = (e.target as HTMLFormElement).query.value.trim();

    // Kiểm tra nếu có giá trị query
    if (query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
    >
      <input
        type="text"
        name="query"
        placeholder="Search for products"
        className="
          bg-gray-100
          text-gray-800
          px-4 py-2
          rounded
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:ring-opacity-50
          border
          w-full
          max-w-4xl
        "
      />
    </form>
  );
}
