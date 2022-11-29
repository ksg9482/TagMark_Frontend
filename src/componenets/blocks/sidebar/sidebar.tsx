import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { dumyTags } from '../../../dumy/dumy-tags';
import { Bookmark } from '../../../interface/bookmark';
export const SideBarContainer = styled.div`
    border: 1px solid;
    margin-right: 5px;
`;

interface Tag {
    id: number;
    name: string;
}
interface TagCountObj extends Tag {
    count: number;
}


const SideBarTagComponenet = (props: any) => {
    const getTagBookmark = props.getTagBookmark;
    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const targetTagName = e.currentTarget.querySelector('.tag_name')?.innerHTML
        getTagBookmark([targetTagName])
    }
    const tag: TagCountObj = props.tagWithCount;

    return (
        <div onClick={onClick}>
            <span className='tag_name'>{tag.name}</span>
            <span>{tag.count}</span>
        </div>
    )
}



const SideBarTags = (props: any) => {

    const tagCountObjArr: TagCountObj[] = props.tagCountObjArr;


    return (
        <div>
            {tagCountObjArr.map((tag) => (
                <SideBarTagComponenet tagWithCount={tag} key={tag.name} getTagBookmark={props.getTagBookmark} />
            ))}
        </div>
    )
}


/*
[tagName] [tagCount]
개발 12
여행 8
프랑스 7

클릭하면 그것만 따로
*/

const SideBar = (props: any) => {
    const isLogin = false//props.isLogin 
    const [tagObj, setTagObj] = useState({
        init:{
            id: 0,
            name: '',
            count: 0
        }
    });
    const [tagWithCounts, setTagWithCounts] = useState(
        [{
            id: 0,
            name: '',
            count: 0
        }]
    );
    const [tagInput, setTagInput] = useState('');
    const createLocalTagArr = (localBookmarks: Bookmark[]) => {
        return localBookmarks.map((localBookmark) => {
            return localBookmark.tags
        }).flat();
    };
    /**
     * @returns {
     *  tagName:{
     *      id: number,
     *      name: string,
     *      count: number
     *  }}
     */
    const createTagObj = (tags: Tag[]) => {
        let result: any = {}
        tags.forEach((tag) => {
            result[tag.name] = { ...tag, count: (result[tag.name]?.count || 0) + 1 }

        })
        return result;
    }
    const setTagCount = (tagobj: any) => {
        let resultArr: TagCountObj[] = [];
        for (let key in tagobj) {
            resultArr.push(tagobj[key])
        }
        return resultArr
    };

    const tagCountObjArr = setTagCount(tagWithCounts);

    const getTags = async (isLogin: boolean) => {
        //로컬 스토리지에서
        if (!isLogin) {
            const localBookmarks: Bookmark[] = JSON.parse(localStorage.getItem('local-bookmark-storage')!)
            const localTagArr: Tag[] = createLocalTagArr(localBookmarks)
            const createdTagObj = createTagObj(localTagArr)
            setTagObj(createdTagObj);
            const tagCountObjArr = setTagCount(createdTagObj);
            return setTagWithCounts(tagCountObjArr)
        }
        else {
            //서버 연결
            return setTagWithCounts(tagCountObjArr)
        }
    }

    const tagSearch = (tagObj:any, tagInput:string):TagCountObj[] => {
        
        const result:TagCountObj[] = [];
        
        for(let tag in tagObj) {
            const tagName:string = tagObj[tag].name;
            if(tagName.includes(tagInput)){
                result.push(tagObj[tag])
            }
        }
        setTagWithCounts(result)
        return result
    }

    const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const inputRefresh = () => {
        const inputValue:any = document.getElementById('side_bar_input')!
        inputValue.value = '';
        setTagInput('');
        
    }
    const tagSearchRefresh = () => {
        const originTagObj = setTagCount(tagObj)
        inputRefresh()
        setTagWithCounts(originTagObj)
    }


    useEffect(() => {
        tagSearch(tagObj, tagInput)
    }, [tagInput])
    useEffect(() => {
        getTags(isLogin)
    }, [])

    return (
        <SideBarContainer>
            <div>
                <span>태그 검색</span>
                <button onClick={tagSearchRefresh}>다 보기</button>
            </div>
            <SideBarInput type="text" id='side_bar_input' defaultValue={tagInput} onChange={inputOnChange} />
            <SideBarTags tagCountObjArr={tagWithCounts} getTagBookmark={props.getTagBookmark} />
        </SideBarContainer>
    )
}

export default SideBar;

const SideBarInput = styled.input`
    max-width: 90%;
`;