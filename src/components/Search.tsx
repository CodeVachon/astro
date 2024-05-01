"use client";
import { ClassNames } from "@codevachon/classnames";
import type { FC } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { SearchIcon, WorkingIcon } from "./Icons";

interface SearchRecord {
    id: string;
    title: string;
    slug: string;
    description: string;
    image: string;
    text: string;
    tags: string[];
}

let searchResult: {
    posts: SearchRecord[];
    tags: { id: string; title: string; slug: string; text: string }[];
} = { posts: [], tags: [] };

export const Search: FC<{ className?: string | ClassNames }> = ({ className = "" }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isWorking, setIsWorking] = useState<boolean>(false);

    const onFocus = useCallback(async (e: React.FocusEvent<HTMLInputElement>) => {
        if (searchResult.posts && searchResult.posts.length > 0) {
            return;
        }

        try {
            setIsWorking(true);
            const results = await fetch("/search.json").then((response) => response.json());

            // Set the Search Result to Cache
            searchResult = results;
            setTimeout(() => {
                setIsWorking(false);
            }, 300);
        } catch (error) {
            console.error("Error fetching search results", error);
        }
    }, []);

    const found = useMemo(() => {
        if (!searchTerm) {
            return [];
        }

        const term = searchTerm.toLowerCase();
        return searchResult.posts
            .filter((post) => {
                return (
                    post.title.toLowerCase().includes(term) ||
                    post.description.toLowerCase().includes(term) ||
                    post.text.toLowerCase().includes(term) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(term))
                );
            })
            .slice(0, 5);
    }, [searchTerm]);

    return (
        <div className={new ClassNames(["group relative"]).add(className).list()}>
            <div
                className={new ClassNames([
                    "absolute bottom-0 left-2 top-0",
                    "flex items-center justify-center",
                    "transition-colors duration-200",
                    "text-slate-950 group-focus-within:text-primary"
                ]).list()}
            >
                {isWorking ? (
                    <WorkingIcon className="size-6 animate-spin" />
                ) : (
                    <SearchIcon className="size-6" />
                )}
            </div>
            <input
                onFocus={onFocus}
                type="search"
                className={new ClassNames([
                    "peer rounded border-0 bg-white/50 py-2 pl-10 pr-4 text-slate-950 focus:bg-white",
                    "focus:outline-none active:outline-none",
                    "ring-0 ring-transparent transition focus:ring-4 focus:ring-primary focus:ring-offset-4"
                ]).list()}
                value={searchTerm}
                onChange={(e) => setSearchTerm(String(e.target.value).trim())}
            />
            {searchTerm.length > 2 && (
                <ul
                    className={new ClassNames([
                        "absolute -ml-2 mt-4 rounded shadow-lg",
                        "bg-white text-slate-950",
                        "flex flex-col gap-0",
                        "overflow-y-auto",
                        "max-h-[400px]"
                    ]).list()}
                >
                    {found.length > 0 ? (
                        found.map((post) => (
                            <li
                                key={post.id}
                                className={new ClassNames(["w-96 p-2", "flex gap-2"]).list()}
                            >
                                <figure className={new ClassNames(["w-24 flex-shrink-0"]).list()}>
                                    <img
                                        src={post.image}
                                        className={new ClassNames([
                                            "size-24 overflow-clip rounded object-cover"
                                        ]).list()}
                                    />
                                </figure>
                                <main>
                                    <a href={post.slug}>
                                        <h2 className={new ClassNames(["text-xl"]).list()}>
                                            {post.title}
                                        </h2>
                                    </a>
                                    <p className={new ClassNames(["line-clamp-3"]).list()}>
                                        {post.description}
                                    </p>
                                </main>
                            </li>
                        ))
                    ) : (
                        <li className={new ClassNames(["w-96 p-2", "flex gap-2"]).list()}>
                            <p>No results found</p>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};
