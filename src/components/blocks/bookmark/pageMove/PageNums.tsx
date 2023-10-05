import { useEffect, useState } from "react";
import { PageNumComponent } from "./PageNumComponent";
import { PageNumsContainer } from "./style";

export const PageNums = (props: any) => {
    const buttonCount = props.buttonCount;
    const [pageFocus, setpageFocus] = useState(1);
    const setButtonNum = (buttonCount:number) => {
        if(buttonCount >= 5) {
            return 5;
        };
        return buttonCount;
        
    };
    const indexAdd = (pageFocus:number) => {
        if(pageFocus >= 4) {
            return pageFocus - 2 
        }
        return 1
    }
    const arr = new Array(setButtonNum(buttonCount)).fill(0).map((data, i) => { return i + indexAdd(pageFocus) })
    
    const PrevDotComponent = () => {
        return (
            <div>...</div>
        )
    }
    const NextDotComponent = () => {
        return (
            <div>...</div>
        )
    }
   useEffect(()=>{
    setpageFocus(props.pageFocus)
   })
    return (
        <PageNumsContainer>
            { pageFocus >= 4 ? <PrevDotComponent />: null}
            {
                arr.map((arrNum, i: number) => {
                    return (
                        <PageNumComponent arrNum={arrNum} key={i} onMoveClick={props.onMoveClick} />
                    )
                })
            }
            { pageFocus >= 4 ? <NextDotComponent />: null}
        </PageNumsContainer>
    )
};

