import styled from "styled-components";

export const UserInfoContainer = styled.div`
    display: grid;
    background-color: white;
    grid-template-rows: 40% 60%;
    padding: 80px 10px 40px 10px;
    gap: 10px;
`;
export const SubContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    gap: 5px;
    border-top: 1px solid #d7d6d6;
    border-left: 1px solid #d7d6d6;
    box-shadow: 2px 2px 2px 2px #d7d6d6;
    padding: 0 5px 0 5px;
    border-radius: 5px;
`;

export const BookmarkAreaContainer = styled.div`
    display: grid;
    align-items: center;
    border-top: 1px solid #d7d6d6;
    border-left: 1px solid #d7d6d6;
    box-shadow: 2px 2px 2px 2px #d7d6d6;
    height: 100%;
    padding: 0 5px 0 5px;
    border-radius: 5px;
`;

export const TagAreaContainer = styled.div`
    display: grid;
    align-items: center;
    height: 100%;
    padding: 0 5px 0 5px;
`;

export const MyDataContainer = styled.div`
    display: grid;
    align-items: center;
    height: 100%;
    padding: 0 5px 0 5px;
    grid-template-rows: 15% min-content auto;
`;

export const GraphContainer = styled.div`
.div {
    position: unset;
}
    height: 400px;
    max-height: 50vh;
`;

export const MyInfoContainer = styled.div`
    display: grid;
    align-self: flex-start;
    gap: 20px;
    margin-bottom: 20px;
    .email-info {
        display: grid;
        gap: 5px;
    }
`;

export const MyDataButtonContainer = styled.div`
    display: grid;
    gap: 30px;
    justify-items: center;
    height: 100%;
    button {
        width: 50%;
        height: fit-content;
    }
    .edit-button{
        display: grid;
        align-self: flex-start;
    }
    .delete-button{
        display: grid;
        align-self: center;
    }
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