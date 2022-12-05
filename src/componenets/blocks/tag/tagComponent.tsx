import styled from "styled-components";
import { TagButton } from "./style";


//태그 tag로 할지 name으로 할지 결정해야됨
const TagComponent = (props: any) => {
    const getTagBookmark=props.getTagBookmark
    const tag = props.tag;
    const onClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        getTagBookmark([e.currentTarget.innerText], 'origin')
    }
    return (
        <TagButton onClick={onClick}>{tag.name ? tag.name : tag.tag}</TagButton>
    )
}

export default TagComponent