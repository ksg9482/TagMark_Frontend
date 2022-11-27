import styled from 'styled-components';
import { dumyTags } from '../../../dumy/dumy-tags';
export const SideBarContainer = styled.div`
    border: 1px solid;
    margin-right: 5px;
`;

interface Tag {
    id: number;
    name: string;
}
const TagComponenet = (props:any) => {
    const tag:Tag = props.tag;
    const tagCount = props.tagCount | 1;
    return(
        <div>
            {tag.name}
            {tagCount}
        </div>
    )
}
const SideBarTags = (props:any) => {
    const tags:Tag[] = props.tags;
    return(
        <div>
            {tags.map((tag)=>(
                <TagComponenet tag={tag} key={tag.name}/>
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
const SideBar = () => {
    return (
        <SideBarContainer>
            <span>태그 검색[ㅁㄴㅇㄴ]</span>
            <SideBarTags tags={dumyTags}/>
        </SideBarContainer>
    )
}

export default SideBar