import styled from "styled-components";

export const LoadingBarConainer = styled.div`
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;

    animation: loading 1s 0s linear infinite;

    .loading span {
    display: inline-block; /* span 내부요소들을 한줄로 세우기 */
    width: 15px;
    height: 15px;
    background-color: #97b5e1;
    border-radius: 50%;    /* span을 동그랗게 */
    animation: loading 1s 0s linear infinite;
    /* 이벤트명  반복시간  딜레이시간  이벤트처리부드럽게  이벤트무한반복*/
    }

    .loading span:nth-child(1) { 
    animation-delay: 0s;
    margin: 5px;
    //background-color: red;
    }

    .loading span:nth-child(2) {
    animation-delay: 0.2s;
    margin: 5px;
    //background-color: orange;
    }

    .loading span:nth-child(3) {
    animation-delay: 0.4s;
    margin: 5px;
    //background-color: yellowgreen;
    }

    @keyframes loading {
    0%,
    100% {
      opacity: 0;
      //transform: scale(0.5);
    };

    50% {
      opacity: 1;
      //transform: scale(1.2);
    };
  }
`;
