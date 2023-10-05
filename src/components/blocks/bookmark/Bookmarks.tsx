import { useSelector } from "react-redux";
import { Bookmark } from "../../../interface/bookmark";
import { RootState } from "../../../store";
import BookmarkComponent from "./BookmarkComponent";
import { BookmarksContainer } from "./style";

const Bookmarks = (props: any) => {
  const bookmarkView = useSelector((state: RootState) => {
    return state.bookmark.bookmarkView;
  });
  return (
    <BookmarksContainer id="bookmarks">
      {bookmarkView.map((bookmark: Bookmark) => (
        <BookmarkComponent
          id={bookmark.id}
          bookmark={bookmark}
          key={bookmark.id}
          getTagBookmark={props.getTagBookmark}
          onBookmarkDelete={props.onBookmarkDelete}
          editSave={props.editSave}
        />
      ))}
    </BookmarksContainer>
  );
};

export default Bookmarks;
