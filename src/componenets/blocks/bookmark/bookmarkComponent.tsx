import Tags from "../tag/tags"
import BookmarkButtonBlock from "./bookmarkOptionButton"

const BookmarkComponent = (props: any) => {
    const bookmark = props.bookmark
    const tags = bookmark.tags
    const bookmarkSlug = bookmark.domain + bookmark.path
    return (
        <div>
            <div>{bookmarkSlug}</div>
            <div><Tags tags={tags}/></div>
            <div><BookmarkButtonBlock /> </div>
        </div>

    )
}

export default BookmarkComponent