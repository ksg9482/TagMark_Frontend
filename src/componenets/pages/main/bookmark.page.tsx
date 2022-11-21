import styled from "styled-components";
import { dumyBookmark } from "../../../dumy/dumy-bookmarks";
import { dumyTags } from "../../../dumy/dumy-tags";
import { Bookmark } from "../../../interface/bookmark";
import Bookmarks from "../../blocks/bookmark/bookmarks";
import SideBar from "../../blocks/sidebar/sidebar";

const TagComponent = (props: any) => {
    const tag = props.tag;
    return (
        <button>{tag.name}</button>
    )
}
//이거 북마크 태그 컴포넌트와 얼만큼 겹치는지?
const Tags = (props: any) => {
    const tags = props.tags
    return (
        <div>{tags.map((tag: Bookmark) => (
            <TagComponent tag={tag} key={tag.id} />
        ))}</div>
    )
}
const EditTags = (props: any) => {
    return (
        <div><Tags tags={props.tags} /></div>
    )
}

const BookMarkEdit = () => {
    return (<div>
        <textarea defaultValue={'북마크가 여기 써져있어야 함'}></textarea>
        <div>
            <EditTags tags={dumyTags} />
        </div>
    </div>)
}

const BookmarkContainer = styled.div`
  display: grid;
  grid-template-columns: 20% auto;
`;


export const BookMark = () => {
    const bookmarks: Bookmark[] = dumyBookmark
    return (
        <BookmarkContainer>
            <SideBar />
            <Bookmarks bookmarks={bookmarks} />
        </BookmarkContainer>
    )
}



//export default BookMark