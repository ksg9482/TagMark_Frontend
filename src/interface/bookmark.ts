import { Tag } from "./tag";

export interface Bookmark {
    id: number;
    domain: string;
    path: string;
    tags: Tag[]
}
