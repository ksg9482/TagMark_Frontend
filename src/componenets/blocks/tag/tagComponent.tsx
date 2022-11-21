import styled from "styled-components";

const TagButton = styled.button`
    background-color: aqua;
    border-color: #355ba3ef;
    border-radius: 5px;
    margin: 2px 5px 3px 5px;
`;
const onClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
}
const TagComponent = (props: any) => {
    const tag = props.tag;
    return (
        <TagButton onClick={onClick}>{tag.name}</TagButton>
    )
}

export default TagComponent