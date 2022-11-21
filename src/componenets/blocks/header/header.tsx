import styled from 'styled-components';
import { ModalPage, UseModal } from '../../pages';


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
    const onlogin = () => {
        // const test = UseModal().openModal()
        // console.log(test)
    }
    return (
        <HeaderContainer>
            {/* {ModalPage().signupModal()} */}
            <span>Header Block</span> 
            <span>로그인시만 가능 - 태그검색</span>
            <span>{ButtonHandle()}</span>
            <button onClick={onlogin}>로그인/회원가입</button>
            <button>로그아웃</button>
        </HeaderContainer>
    )
};

const HeaderContainer = styled.div`
    position: fixed;
    width: 100%;
    border: 1px solid;
    background-color: white;
`

export default Header;