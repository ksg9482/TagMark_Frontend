import styled from "styled-components";
import { Bookmark } from "../../../interface/bookmark";
import TagComponent from "./tagComponent";

const TagsContainer = styled.div`
  row-gap: 5px;
`;
const Tags = (props: any) => {
    const tags = props.tags
    return (
        <TagsContainer>
            {tags.map((tag: Bookmark) => (
            <TagComponent tag={tag} key={tag.id} />
        ))}
        </TagsContainer>
    )
}

export default Tags