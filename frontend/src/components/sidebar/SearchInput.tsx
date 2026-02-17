import { IoSearchSharp } from "react-icons/io5";
import { useState } from "react";
import type { SubmitEvent } from "react";

const SearchInput = () => {
    const [search, setSearch] = useState("");
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!search) return;

        if (search.length < 3) {
            return "Search term must be at least 3 characters long";
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
            <input
                type="text"
                placeholder="Search…"
                className="w-full rounded-full border border-gray-600 bg-gray-700 text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button
                type="submit"
                className="flex items-center justify-center rounded-full bg-sky-500 p-2 hover:bg-sky-600 transition-colors"
            >
                <IoSearchSharp className="w-5 h-5 text-white" />
            </button>
        </form>
    );
};

export default SearchInput;
