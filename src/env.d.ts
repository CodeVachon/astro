/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface IGithubRepo {
    name: string;
    description: string;
    sshUrl: string;
    homepageUrl: string;
    url: string;
    forkCount: number;
    stargazerCount: number;
    watchers: {
        totalCount: number;
    };
    languages: {
        nodes: {
            color: string;
            name: string;
        }[];
    };
}

interface IGithubUser {
    avatarUrl: string;
    company?: string;
    login: string;
    url: string;
    name: string;
    pinnedItems: {
        nodes: IGithubRepo[];
    };
}

interface IGitHubRepoObjects {
    id: string;
    name: string;
    url: string;
    branch: {
        entries: {
            name: string;
            type: string;
            object: {
                byteSize: number;
                text: string;
            };
        }[];
    };
}
