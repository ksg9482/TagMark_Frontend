import styled from 'styled-components';
export const HeaderContainer = styled.div`
    border: 1px solid;
`
const Header = () => {
    const MypageButton = () => {
        return (<button>마이페이지</button>)
    }
    const MainButton = () => {
        return (<button>메인</button>)
    }
    const ButtonHandle = () => {
        const tempCondition = true;
        return tempCondition ? <MainButton /> : <MypageButton />
    }
    return (
        <HeaderContainer>
            <span>Header Block</span> 
            <span>로그인시만 가능 - 태그검색</span>
            <span>{ButtonHandle()}</span>
            <button>로그아웃</button>
        </HeaderContainer>
    )
}

export default Header