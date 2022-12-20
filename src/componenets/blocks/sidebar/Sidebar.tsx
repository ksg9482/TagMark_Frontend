import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { dumyTags } from '../../../dumy/dumy-tags';
import { Bookmark } from '../../../interface/bookmark';
import { Tag, TagCountObj } from '../../../interface/tag';
import { customAxios } from '../../../utils/axios/customAxios';
import { secure } from '../../../utils/secure';
import { CommonButton, SideBarContainer, SideBarInput } from './style';





const SideBarTagComponenet = (props: any) => {
    const getTagBookmarkSideBar = props.getTagBookmarkSideBar;
    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const targetTagName = e.currentTarget.querySelector('.tag_name')?.innerHTML
        getTagBookmarkSideBar([targetTagName], 'origin')
    }
    const tag: TagCountObj = props.tagWithCount;

    return (
        <SideBarTagComponent onClick={onClick}>
            <TagNameContainer className='tag_name'>{tag.tag}</TagNameContainer>
            <CountContainer>{tag.count}</CountContainer>
        </SideBarTagComponent>
    )
}
const CountContainer = styled.div`
    white-space: nowrap;
`;
const SideBarTagComponent = styled.div`
    display: grid;
    grid-template-columns: 80% 20%;
    justify-items: center;
    align-items: center;
    max-width: 100%;
    overflow-x: auto;
    padding: 0 5px 0 10px;
    word-break: break-all;
    border-bottom: 2px solid white;
    &:hover {
        border-bottom: 2px solid transparent;
        border-image: linear-gradient(to right, #ffffff, #eed69d,#ffffff);
        border-image-slice: 1;
    }
`;

const TagNameContainer = styled.div`
    padding-right: 10px;
`;



const SideBarTags = (props: any) => {
    const tagCountObjArr: TagCountObj[] = props.tagCountObjArr;

    return (
        <SideBarTagsContainer>
            {tagCountObjArr.map((tag) => (
                <SideBarTagComponenet tagWithCount={tag} key={tag.tag} getTagBookmarkSideBar={props.getTagBookmarkSideBar} />
            ))}
        </SideBarTagsContainer>
    )
}
const SideBarTagsContainer = styled.div`
    border: 1px solid #1C3879;
    border-radius: 5px;
    display: grid;
    margin-top: 20px;
    padding: 5px 0 5px 0;
    gap: 5px;
    width: 100%;
`;

/*
[tagName] [tagCount]
개발 12
여행 8
프랑스 7

클릭하면 그것만 따로
*/

const SideBar = (props: any) => {
    const isLogin = props.isLogin
    const [originBookmarks, setOriginBookmarks] = useState([{ id: 0, url: '', tags: [{ id: 0, name: '' }] }])
    const [tagObj, setTagObj] = useState({
        init: {
            id: 0,
            tag: '',
            count: 0
        }
    });
    const [tagWithCounts, setTagWithCounts] = useState(
        [{
            id: 0,
            tag: '',
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
            result[tag.tag] = { ...tag, count: (result[tag.tag]?.count || 0) + 1 }

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


    const sendGetTagCount = async () => {
        return await customAxios.get(`/tag`)
    }
    const getTags = async (isLogin: boolean, bookmark: any) => {
        //로컬 스토리지에서. 뷰는 페이지네이션 적용해서 직접가져와야 정확
        if (!isLogin) {
            const localBookmarks: Bookmark[] = JSON.parse(secure().local().getItem('local-bookmark-storage')!)

            const localTagArr: Tag[] = createLocalTagArr(localBookmarks)//createLocalTagArr(originBookmarks)
            const createdTagObj = createTagObj(localTagArr)
            setTagObj(createdTagObj);
            const tagCountObjArr = setTagCount(createdTagObj);
            return setTagWithCounts(tagCountObjArr)
        }
        else {
            //서버 연결
            const tagData = await sendGetTagCount()
            const tempForm = tagData.data.tags.map((tag: any) => {
                return { ...tag, name: tag.tag }
            })
            setTagObj(tempForm);
            return setTagWithCounts(tempForm)
        }
    }

    const tagSearch = (tagObj: any, tagInput: string): TagCountObj[] => {

        const result: TagCountObj[] = [];

        for (let tag in tagObj) {
            const tagName: string = tagObj[tag].tag;
            if (tagName.includes(tagInput)) {
                result.push(tagObj[tag])
            };
        };
        setTagWithCounts(result);
        return result;
    }

    const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const inputRefresh = () => {
        const inputValue: any = document.getElementById('side_bar_input')!
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
        getTags(isLogin, props.originBookmarks)
    }, [originBookmarks])
    useEffect(() => {
        setOriginBookmarks(props.originBookmarks)
    })
    return (
        <SideBarContainer>
            <SideBarTextContainer>
                <div>태그검색</div>
                <CommonButton onClick={tagSearchRefresh}>초기화</CommonButton>
            </SideBarTextContainer>
            <SideBarInput type="text" id='side_bar_input' defaultValue={tagInput} onChange={inputOnChange} />
            <SideBarTags tagCountObjArr={tagWithCounts} getTagBookmarkSideBar={props.getTagBookmarkSideBar} />
        </SideBarContainer>
    )
}

export default SideBar;

const SideBarTextContainer = styled.div`
display: grid;
grid-template-columns: auto auto;
gap: 2px;
margin: 10px 0 5px 0;
align-items: center;
width: 100%;
`;
