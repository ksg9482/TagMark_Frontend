import { Tag } from "./tag";

export interface Bookmark {
    id: any;
    url: string;
    tags: Tag[]
}

export interface CreateBookmarkData {
    id?: any;
    url: string;
    tags: string[];
};