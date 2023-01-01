import { Bookmark } from "../../../interface/bookmark"
import BookmarkComponent from "./BookmarkComponent"
import { BookmarksContainer } from "./style"

const Bookmarks = (props: any) => {
    console.log(props.bookmarkView)
    const bookmarkView: Bookmark[] = props.bookmarkView
    return (
        <BookmarksContainer id="bookmarks">
            {bookmarkView.map((bookmark: Bookmark) => (
                <BookmarkComponent id={bookmark.id} bookmark={bookmark} key={bookmark.id} getTagBookmark={props.getTagBookmark} onBookmarkDelete={props.onBookmarkDelete} editSave={props.editSave}/>
            ))}
        </BookmarksContainer>
    )
}

export default Bookmarks
