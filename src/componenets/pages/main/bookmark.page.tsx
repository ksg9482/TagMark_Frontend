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




const BookMark = () => {
    const bookmarks: Bookmark[] = DumyBookmark
    return (
        <div>
            <div>BookMark</div>
            <div>
                <Bookmarks bookmarks={bookmarks}/>
            </div>
        </div>
    )
}

export default BookMark