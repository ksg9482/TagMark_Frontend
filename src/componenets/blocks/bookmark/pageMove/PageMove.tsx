import { useEffect, useState } from "react";
import { PageNums } from "./PageNums";
import { PageButtonsContainer, PageButtonsContent } from "./style";

export const PageMove = (props: any) => {
    const pagenationNum = props.pagenationNum;
    const [pageFocus, setpageFocus] = useState(1)
    const bookmarkMax = 20;
    const count = props.count;
    const firstPageNum = 1;
    const onMoveClick = (move: any) => {
        setpageFocus(move)
        pagenationNum(move)
    }
    const onClick = (move: any) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (move < firstPageNum || move > count) {
            return;
        }

        onMoveClick(move)
    };
    useEffect(() => {
        setpageFocus(props.currentPageNum)
    })
    return (
        <PageButtonsContainer id="move-button">
            <PageButtonsContent>
                <div onClick={onClick(firstPageNum)}> 맨앞</div>
                <div onClick={onClick(pageFocus - 1)}> 이전</div>
                <PageNums buttonCount={count} onMoveClick={onMoveClick} pageFocus={pageFocus} />
                <div onClick={onClick(pageFocus + 1)}>이후</div>
                <div onClick={onClick(count)}>맨뒤</div>
            </PageButtonsContent>
        </PageButtonsContainer>
    )
};








