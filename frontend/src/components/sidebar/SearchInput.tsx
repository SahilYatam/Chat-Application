import { Search } from "lucide-react";
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
        <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search…"
                className="input-sm md:input input-bordered rounded-full sm:rounded-full w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button
                type="submit"
                className="btn md:btn-md btn-sm btn-circle bg-sky-500 text-white  "
            >
                <Search className="w-4 h-4 md:w-6 md:h-6 outline-none" />
            </button>
        </form>
    );
};

export default SearchInput;
