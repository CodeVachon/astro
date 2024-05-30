import React, { useCallback, useEffect, useState } from "react";
import { SearchIcon, SpinnerIcon } from "./Icons";
// import * as pkg from "bloom-filters";
// const { BloomFilter } = pkg;

interface ISearchProps {
    className?: string;
    children?: React.ReactNode;
}

const Search: React.FC<ISearchProps> = ({ className = "" }) => {
    const [term, setTerm] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [recordSet, setRecordSet] = useState<{
        articles: Array<{
            title: string;
            description: string;
            image?: { width: number; height: number; src: string };
            link: string;
            tags: Array<string>;
            bloom: Array<string>;
        }>;
    }>({ articles: [] });
    const [selectedElementIndex, setSelectedElementIndex] = useState<number>(-1);

    const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "ArrowDown" || event.code === "ArrowUp" || event.code === "Enter") {
            event.preventDefault();
            event.stopPropagation();

            if (event.code === "ArrowDown") {
                setSelectedElementIndex((prev) => {
                    return prev + 1;
                });
            } else if (event.code === "ArrowUp") {
                setSelectedElementIndex((prev) => {
                    return prev - 1;
                });
            } else if (event.code === "Enter") {
                const selectedElement = document.querySelector(
                    "#BlogSearchResult > li.selected > a"
                );
                if (selectedElement) {
                    window.location.href = (selectedElement as HTMLAnchorElement).href;
                }
            }
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetch("/search-core.json")
            .then((response) => response.json())
            .then((data) => {
                setRecordSet(data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const results = React.useMemo(() => {
        if (term.trim().length === 0) {
            return [];
        }

        const found: Array<{ article: any; score: number }> = [];
        const searchTerms = term.split(new RegExp("[\\s]{1,}", "g"));
        for (const article of recordSet.articles) {
            // const filter = BloomFilter.fromJSON(article.bloom);

            let score = 0;
            // for (const search of searchTerms) {
            //     if (filter.has(search.trim().toLowerCase())) {
            //         score++;
            //     }
            // }
            for (const search of searchTerms) {
                if (new RegExp(search, "gi").test(article.title)) {
                    score = score + 10;
                }
                if (new RegExp(search, "gi").test(article.description)) {
                    score = score + 5;
                }
                if (article.tags.includes(search)) {
                    score = score + 7;
                }
                if (article.bloom.includes(search)) {
                    score++;
                }
            }

            if (score > 0) {
                found.push({ article, score });
            }
        }

        found.sort((a, b) => b.score - a.score);

        return found.map((record) => record.article).slice(0, 5);
    }, [term, recordSet]);

    useEffect(() => {
        if (selectedElementIndex === -1) {
            return;
        }

        if (selectedElementIndex >= results.length) {
            setSelectedElementIndex(0);
        } else if (selectedElementIndex < 0) {
            setSelectedElementIndex(results.length - 1);
        }
    }, [selectedElementIndex, results]);

    return (
        <div className={className}>
            <div className="relative">
                <input
                    name="blog-search"
                    id="BlogSearch"
                    type="search"
                    value={term}
                    onChange={(e) => {
                        setTerm(e.target.value);
                        setSelectedElementIndex(-1);
                    }}
                    className="w-full rounded-none bg-white py-4 pl-14 pr-4 text-slate-950 dark:bg-slate-900 dark:text-white"
                    placeholder="Search Blog Posts..."
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    onKeyDown={onKeyDown}
                />
                <div className="absolute bottom-0 left-4 top-0 flex items-center">
                    {isLoading ? (
                        <SpinnerIcon className="size-6 animate-spin text-primary" />
                    ) : (
                        <SearchIcon />
                    )}
                </div>
            </div>
            {term.length > 0 && (
                <ul className="my-2" id="BlogSearchResult">
                    {results.map((result: any, index) => (
                        <li
                            key={result.title}
                            className={
                                index === selectedElementIndex ? "selected bg-primary/50" : ""
                            }
                        >
                            <a
                                href={result.link}
                                className="flex gap-4 px-4 py-2 decoration-transparent  hover:decoration-transparent"
                            >
                                <figure className="shrink-0">
                                    <img
                                        src={result.image.src}
                                        alt={result.title}
                                        width={result.image.width}
                                        height={result.image.height}
                                    />
                                </figure>
                                <div>
                                    <p className="text-xl">{result.title}</p>
                                    <p className="line-clamp-3 overflow-hidden text-ellipsis">
                                        {result.description}
                                    </p>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
export { Search };
