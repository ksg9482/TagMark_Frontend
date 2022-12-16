import styled from "styled-components";

export const BookmarkContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 20% auto;
  @media (max-width: 1000px) {
    grid-template-columns: 20% 10% auto;
  }
  @media (max-width: 640px) {
    grid-template-columns: 20% 5% auto;
  }
  padding: 50px 10px 40px 5px;
  background-color: white;
`;

export const BookmarkManageContainer = styled.div`
  display: grid;
  grid-template-rows: 50px 50px auto;
`;

export const BookmarkManagebuttonContainer = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
  @media (max-width: 1200px) {
    grid-template-columns: 50% 50%;
  }
  align-items: center;
  justify-items: center;
  min-width: max-content;
`;