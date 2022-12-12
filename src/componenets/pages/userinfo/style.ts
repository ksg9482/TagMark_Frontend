import styled from "styled-components";

export const UserInfoContainer = styled.div`
    display: grid;
    grid-template-rows: 50% 50%;
    height: 800px;
    max-height: 90vh;
    gap: 5px;
`;
export const SubContainer = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
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
    //height: 100%;
`;

export const MyDataContainer = styled.div`
    display: grid;
    align-items: center;
    border: 2px 2px 2px 2px;
    border-style: groove;
    height: 475px;
`;

export const GraphContainer = styled.div`
.div {
    position: unset;
}
    height: 450px;
    max-height: 50vh;
    //max-width: 200px;
`;