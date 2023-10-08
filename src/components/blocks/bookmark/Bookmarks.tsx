import { useSelector } from "react-redux";
import { Bookmark } from "../../../interface/bookmark";
import { RootState } from "../../../store";
import BookmarkComponent from "./BookmarkComponent";
import { BookmarkComponentInner, BookmarksContainer } from "./style";

const Bookmarks = (props: any) => {
  const bookmarkView = useSelector((state: RootState) => {
    return state.bookmark.bookmarkView;
  });
  return (
    <BookmarksContainer id="bookmarks">
      {bookmarkView.length > 0 ? (
        bookmarkView.map((bookmark: Bookmark) => (
          <BookmarkComponent
            id={bookmark.id}
            bookmark={bookmark}
            key={bookmark.id}
            getTagBookmark={props.getTagBookmark}
            onBookmarkDelete={props.onBookmarkDelete}
            editSave={props.editSave}
          />
        ))
      ) : (
        <BookmarkComponentInner id="bookmark-component-inner-empty"></BookmarkComponentInner>
      )}
    </BookmarksContainer>
  );
};

export default Bookmarks;
