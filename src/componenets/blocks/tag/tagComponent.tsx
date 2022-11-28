import styled from "styled-components";

const TagButton = styled.button`
    background-color: aqua;
    border-color: #355ba3ef;
    border-radius: 5px;
    margin: 2px 5px 3px 5px;
`;

const TagComponent = (props: any) => {
    const getTagBookmark=props.getTagBookmark
    const tag = props.tag;
    const onClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        getTagBookmark([e.currentTarget.innerText])
    }
    return (
        <TagButton onClick={onClick}>{tag.name}</TagButton>
    )
}

export default TagComponent