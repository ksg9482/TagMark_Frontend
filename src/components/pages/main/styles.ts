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
  align-items: center;
  justify-items: center;
  width: 98%;
  min-width: max-content;
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
