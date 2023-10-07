import styled from "styled-components";

export const BookmarkContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 15% auto;
  @media (max-width: 1000px) {
    grid-template-columns: 20% 10% auto;
  }
  @media (max-width: 640px) {
    grid-template-columns: 20% 5% auto;
    box-sizing: border-box;
  }
  padding: 80px 10px 40px 10px;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  background-color: white;
  max-width: 100%;
  min-height: auto;
`;

export const BookmarkManageContainer = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
`;

export const ContentBox = styled.div`
  padding: 10px 5px 10px 5px;
  box-shadow: 2px 2px 2px 2px #bbbbbb;
  border-radius: 5px;
  margin-bottom: 5px;
`;

export const BookmarkManagebuttonContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  /* @media (max-width: 1200px) {
    grid-template-columns: 50% 50%;
  } */
  align-items: center;
  justify-items: center;
  width: 98%;
  min-width: max-content;
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

export const DisableCommonButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  white-space: nowrap;
  min-width: fit-content;
  background-color: #f9f9f9;

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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  transition: 0.2s;
`;

export const ManageButtonContainer = styled.div`
  display: grid;
  grid-template-columns: auto min-content;
  gap: 10px;
  justify-items: end;
  width: 100%;
  margin-right: 5px;
`;
export const TagText = styled.div`
  display: grid;
  align-items: center;
  margin: 10px 0 10px 0;
`;
