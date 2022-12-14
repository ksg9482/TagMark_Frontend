import styled from "styled-components";

export const UserInfoContainer = styled.div`
    display: grid;
    background-color: white;
    grid-template-rows: 40% 60%;
    padding: 50px 10px 40px 10px;
    //height: 100%;
    gap: 5px;
`;
export const SubContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    //height: 300px;
    //gap: 2px;
`;

export const BookmarkAreaContainer = styled.div`
    display: grid;
    align-items: center;
    border: 2px solid;
    height: 100%;
    
`;

export const TagAreaContainer = styled.div`
    display: grid;
    align-items: center;
    border: 2px 2px 2px 2px;
    border-style: groove;
    height: 100%;
`;

export const MyDataContainer = styled.div`
    display: grid;
    align-items: center;
    border: 2px 2px 2px 2px;
    border-style: groove;
    height: 100%;
`;

export const GraphContainer = styled.div`
.div {
    position: unset;
}
    height: 400px;
    max-height: 50vh;
    //max-width: 200px;
`;