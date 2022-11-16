import { Bookmark } from "../../../interface/bookmark"
import BookmarkComponent from "./bookmarkComponent"


const Bookmarks = (props: any) => {
    const bookmarks = props.bookmarks
    return (
        <div>
            {bookmarks.map((bookmark: Bookmark) => (
                <BookmarkComponent bookmark={bookmark} key={bookmark.id} />
            ))}
        </div>
    )
}

export default Bookmarks