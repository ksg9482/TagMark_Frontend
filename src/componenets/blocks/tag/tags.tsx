import styled from "styled-components";
import { Bookmark } from "../../../interface/bookmark";
import { Tag } from "../../../interface/tag";
import TagComponent from "./tagComponent";

const TagsContainer = styled.div`
  row-gap: 5px;
`;
const Tags = (props: any) => {
    const tags:Array<any> = props.tags
    const bookmarkKey = props.bookmarkKey
    return (
        <TagsContainer>
            {tags.map((tag: Tag) => (
            <TagComponent tag={tag} key={tag.name} />
        ))}
        </TagsContainer>
    )
}

export default Tags