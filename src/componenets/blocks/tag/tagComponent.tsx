import { TagButton } from "./style";

const TagComponent = (props: any) => {
    const getTagBookmark=props.getTagBookmark
    const tag = props.tag;
    const onClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        getTagBookmark([e.currentTarget.innerText], 'origin')
    }
    return (
        <TagButton onClick={onClick}>{tag.tag}</TagButton>
    )
}

export default TagComponent