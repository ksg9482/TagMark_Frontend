import { Bookmark } from "../../../interface/bookmark";
import TagComponent from "./tagComponent";


const Tags = (props: any) => {
    const tags = props.tags
    return (
        <div>{tags.map((tag: Bookmark) => (
            <TagComponent tag={tag} key={tag.id} />
        ))}</div>
    )
}

export default Tags