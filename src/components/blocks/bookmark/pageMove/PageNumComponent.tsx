export const PageNumComponent = (props: any) => {
    const onMoveClick = props.onMoveClick
    const arrNum = props.arrNum
    const onClick = (move:any) => (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        onMoveClick(move)
    };
    return (
        <div onClick={onClick(arrNum)}>
            {arrNum}
        </div>
    )
}