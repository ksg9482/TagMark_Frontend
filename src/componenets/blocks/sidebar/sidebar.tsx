import styled from 'styled-components';
export const SideBarContainer = styled.div`
    border: 1px solid;
`;

const SideBar = () => {
    return (
        <SideBarContainer>
            <span>SideBar Block</span>
            <div>태그(태그명+총 몇개인지)</div> 
        </SideBarContainer>
    )
}

export default SideBar