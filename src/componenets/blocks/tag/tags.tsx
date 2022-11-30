import styled from "styled-components";
import { Bookmark } from "../../../interface/bookmark";
import { Tag } from "../../../interface/tag";
import { TagsContainer } from "./style";
import TagComponent from "./tagComponent";


const Tags = (props: any) => {
    const tags:Array<any> = props.tags
    const bookmarkKey = props.bookmarkKey
    return (
        <TagsContainer>
            {tags.map((tag: Tag) => (
            <TagComponent tag={tag} key={tag.name} getTagBookmark={props.getTagBookmark}/>
        ))}
        </TagsContainer>
    )
}

export default Tags