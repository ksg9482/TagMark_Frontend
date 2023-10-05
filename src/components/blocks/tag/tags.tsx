import { Tag } from "../../../interface/tag";
import { TagsContainer } from "./style";
import TagComponent from "./tagComponent";


const Tags = (props: any) => {
    const tags:Array<any> = props.tags
    return (
        <TagsContainer>
            {tags.map((tag: Tag) => (
            <TagComponent tag={tag} key={tag.id} getTagBookmark={props.getTagBookmark}/>
        ))}
        </TagsContainer>
    )
}

export default Tags