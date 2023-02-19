import { AxiosResponse } from "axios";
import { Tag } from "./tag";

export interface Bookmark {
    id: any;
    url: string;
    tags: Tag[]
};

export interface CreateBookmarkData {
    id?: any;
    url: string;
    tagNames: string[];
};

export enum FindType {
    origin = 'origin',
    view = 'view'
}

export interface LocalBookmark {
    dataFrom: 'local', bookmark: string
}
export interface RemoteBookmark {
    dataFrom: 'remote', bookmark: AxiosResponse
}

export type GetBookmarkOption = LocalBookmark | RemoteBookmark;
export enum CurrentSearch {
    Bookmark = 'Bookmark',
    TagSearch = 'TagSearch',
    SideBarSearch = 'SideBarSearch'
}