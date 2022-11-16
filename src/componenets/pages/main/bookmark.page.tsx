import { Bookmark } from "../../../interface/bookmark";
import Bookmarks from "../../blocks/bookmark/bookmarks";

const DumyBookmark = [
    {
        id: 1,
        domain: 'https://www.naver.com',
        path: '/temp/test',
        tags: [
            {
                id: 1,
                name: '요리'
            },
            {
                id: 2,
                name: '야채'
            },
            {
                id: 3,
                name: '철판'
            },
            {
                id: 4,
                name: '외국'
            }
        ]
    },
    {
        id: 2,
        domain: 'https://www.naver.com',
        path: '/temp/23rr',
        tags: [
            {
                id: 5,
                name: '비건'
            },
            {
                id: 2,
                name: '야채'
            },
            {
                id: 3,
                name: '철판'
            },
            {
                id: 6,
                name: '프랑스'
            }
        ]
    }
];

const dumyTags = [
    {id:11, name:'개발'},
    {id:6, name:'프랑스'},
    {id:4, name: '외국'},
]
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
const EditTags = (props:any) => {
    return (
        <div><Tags tags={props.tags}/></div>
    )
}

const BookMarkEdit = () => {
    return(<div>
        <textarea defaultValue={'북마크가 여기 써져있어야 함'}></textarea> 
        <div>
        <EditTags tags={dumyTags}/>
        </div>
    </div>)
}

export const BookMark = () => {
    const bookmarks: Bookmark[] = DumyBookmark
    return (
        <div>
            <div>BookMark</div>
            <div>
                <div>북마크 추가 블럭</div>
                <Bookmarks bookmarks={bookmarks}/>
            </div>
        </div>
    )
}

//export default BookMark