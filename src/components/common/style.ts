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
    border-radius: 50%; /* span을 동그랗게 */
    animation: loading 1s 0s linear infinite;
    /* 이벤트명  반복시간  딜레이시간  이벤트처리부드럽게  이벤트무한반복*/
  }

  .loading span:nth-child(1) {
    animation-delay: 0s;
    margin: 5px;
  }

  .loading span:nth-child(2) {
    animation-delay: 0.2s;
    margin: 5px;
  }

  .loading span:nth-child(3) {
    animation-delay: 0.4s;
    margin: 5px;
  }

  @keyframes loading {
    0%,
    100% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }
  }
`;
export const CommonTextArea = styled.textarea`
  resize: none;
`;

export const CommonButtonContainer = styled.div`
  display: grid;
  justify-items: center;
  gap: 5px;
  margin-top: 15px;
  grid-template-columns: 1fr 1fr;
`;

export const CommonButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  white-space: nowrap;
  min-width: fit-content;
  background-color: #f9f9f9;
  &:hover {
    background-color: #e7e7e7;
  }

  margin: 0;
  padding: 0.2rem 0.5rem;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: auto;
  border: none;
  border-radius: 4px;
  box-shadow: 3px 4px 2px -1px rgba(0, 0, 0, 0.1),
    3px 4px 2px -1px rgba(0, 0, 0, 0.06);

  transition: 0.2s;
  background-color: rgba(0, 0, 0, 0.03);
`;
