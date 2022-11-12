const TagComponent = (props: any) => {
    const tag = props.tag;
    return (
        <button>{tag.name}</button>
    )
}

export default TagComponent