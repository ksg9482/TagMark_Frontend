import styled from "styled-components";

export const SideBarInput = styled.input`
    width: 95%;
    margin-top: 15px;
`;

export const SideBarContainer = styled.div`
    display: grid;
    grid-template-rows: min-content min-content auto;
    height: fit-content;
    padding: 0 5px 5px 5px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px 2px #bbbbbb;
    width: 100%;
    justify-items: center;
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  transition: 0.2s;
`;

export const CountContainer = styled.div`
    white-space: nowrap;
`;
export const SideBarTagComponent = styled.div`
    display: grid;
    grid-template-columns: 80% 20%;
    justify-items: center;
    align-items: center;
    max-width: 100%;
    overflow-x: auto;
    padding: 0 5px 0 10px;
    word-break: break-all;
    border-bottom: 2px solid white;
    &:hover {
        border-bottom: 2px solid transparent;
        border-image: linear-gradient(to right, #ffffff, #eed69d,#ffffff);
        border-image-slice: 1;
    }
`;

export const TagNameContainer = styled.div`
    padding-right: 10px;
`;

export const SideBarTagsContainer = styled.div`
    border: 1px solid #1C3879;
    border-radius: 5px;
    display: grid;
    margin-top: 20px;
    padding: 5px 0 5px 0;
    gap: 5px;
    width: 100%;
`;

export const SideBarTextContainer = styled.div`
display: grid;
grid-template-columns: auto auto;
gap: 2px;
margin: 10px 0 5px 0;
align-items: center;
width: 100%;
`;