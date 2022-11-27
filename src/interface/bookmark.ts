import { Tag } from "./tag";

export interface Bookmark {
    id: number;
    url: string;
    tags: Tag[]
}
