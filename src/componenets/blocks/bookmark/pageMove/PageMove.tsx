import { useEffect, useState } from "react";
import { PageNums } from "./PageNums";
import { PageButtonsContainer } from "./style";

export const PageMove = (props: any) => {
    const pagenationNum = props.pagenationNum;
    const [pageFocus, setpageFocus] = useState(1)
    const bookmarkMax = 20;
    const count = props.count;
    const firstPageNum = 1;
    //const buttonCount = Math.ceil(count / bookmarkMax);
    //const buttonCount = Math.ceil(count / bookmarkMax);
    const onMoveClick = (move:any) => {
        setpageFocus(move)
        pagenationNum(move)
        //맨앞 index0, 이전index-1, 이후index+1, 맨뒤 index 마지막
    }
    const onClick = (move:any) => (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=> {
        //console.log('클릭',move)
        if(move < firstPageNum ||move > count) {
            return ;
        }

        onMoveClick(move)
    };
    useEffect(()=>{
        setpageFocus(props.currentPageNum)
    })
    return (
        <PageButtonsContainer>
            <div onClick={onClick(firstPageNum)}>맨앞</div>
            <div onClick={onClick(pageFocus-1)}>이전</div>
            <PageNums buttonCount={count} onMoveClick={onMoveClick} pageFocus={pageFocus}/>
            <div onClick={onClick(pageFocus+1)}>이후</div>
            <div onClick={onClick(count)}>맨뒤</div>
        </PageButtonsContainer>
    )
};








