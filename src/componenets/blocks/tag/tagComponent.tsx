import styled from "styled-components";
import { TagButton } from "./style";



const TagComponent = (props: any) => {
    const getTagBookmark=props.getTagBookmark
    const tag = props.tag;
    const onClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        getTagBookmark([e.currentTarget.innerText], 'view')
    }
    return (
        <TagButton onClick={onClick}>{tag.name}</TagButton>
    )
}

export default TagComponent