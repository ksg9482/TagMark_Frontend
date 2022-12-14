import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { customAxios } from '../../../utils/axios/customAxios';
import { ModalPage } from '../../pages';
import { CommonButton, HeaderContainer } from './style';



const Header = (props: any) => {
    const reactLocation = useLocation()
    const [isLogin, setIsLogin] = useState(false)
    const [logoutFocused, setlogoutFocused] = useState(false);

    const UseModal = () => {
        const [isShowModal, setIsShowModal] = useState(false);

        const openModal = useCallback(() => {
            setIsShowModal(true);
        }, [setIsShowModal]);

        const closeModal = useCallback(() => {
            setIsShowModal(false);
        }, [setIsShowModal]);

        const toggleModal = useCallback(() => {
            setIsShowModal(prev => !prev);
        }, [setIsShowModal]);

        return { isShowModal, openModal, closeModal, toggleModal };
    }
    const useModal = UseModal()
    const navigate = useNavigate()
    const navUserInfo = () => {
        navigate('/me')
    }
    const navMain = () => {
        navigate('/')
    }
    const MypageButton = () => {
        return (
            <CommonButton onClick={navUserInfo}>
                내정보
            </CommonButton>
        )
    }
    const MainButton = () => {
        return (
            <CommonButton onClick={navMain}>
                북마크
            </CommonButton>
        )
    }
    const sendLogout = async () => {
        //서버요청
        try {
            await customAxios.get(`/user/logout`);
            localStorage.removeItem('accessToken')
            // eslint-disable-next-line no-restricted-globals
            //location.reload()
            //console.log('로그아웃 응답 반환')
        } catch (error) {
            console.log(error)
        }

    }
    const deleteLocalUserData = () => {
        //액세스토큰 삭제
        localStorage.removeItem('user')
        navigate('/', { replace: true });
    }
    const onLogout = async () => {

        deleteLocalUserData()
        //로그아웃인데 굳이 응답 기다려야 하나? 이럭 위한 메시지큐?
        localStorage.removeItem('accessToken')
        await sendLogout()
        // eslint-disable-next-line no-restricted-globals
        location.reload()
    }
    const ButtonHandle = () => {
        const isMainPage = reactLocation.pathname === '/' ? true : false
        return isMainPage ? <MypageButton /> : <MainButton />
    }


    const loginedHeader = () => {


        const LoggedIn = () => {
            return (
                <LoggedInButton onMouseOver={() => setlogoutFocused(true)} >
                    Logged In
                </LoggedInButton>
            )
        };


        const Logout = () => {
            return (
                <LogoutButton onClick={onLogout} onMouseOut={() => setlogoutFocused(false)}>
                    Logout
                </LogoutButton>
            )
        };

        //그냥 로그아웃, 로그인중 버튼은 따로 만들어서 쓰자. 내용이랑 색이랑 따로논다.
        return (
            <HeaderContainer id='header'>
                <div></div>
                {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
                <HeaderContent>
                    <div>Tag Mark</div>
                    <div></div>
                    <ButtonContainer>
                        <HeaderButtonContainer>{ButtonHandle()}</HeaderButtonContainer>
                        <HeaderButtonContainer >{logoutFocused ? <Logout /> : <LoggedIn />}</HeaderButtonContainer>
                    </ButtonContainer>
                </HeaderContent>
                <div></div>
            </HeaderContainer>

        )
    }
    const ButtonContainer = styled.div`
        display: grid;
        grid-template-columns: auto auto;
    `;
    const HeaderButtonContainer = styled.div`
        display:grid;
        justify-items: end;
    `;
    const HeaderContent = styled.div`
        display: grid;
        grid-template-columns: 20% auto auto;
        padding: 0 10px 0 0;
    `;
    const unLoginHeader = () => {
        return (
            <HeaderContainer id='header'>
                <div></div>
                {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
                <HeaderContent>
                    <div>Tag Mark</div>
                    <div></div>
                    <button onClick={onlogin}>로그인</button>
                </HeaderContent>
                <div></div>
            </HeaderContainer>
        )
    }
    const onlogin = () => {
        useModal.openModal();
    }
    useEffect(() => {
        setIsLogin(props.isLogin)
    }, [])
    //이것도 컴포넌트로 만들어서 컴포넌트 반환하게 통일
    return isLogin ? loginedHeader() : unLoginHeader()
};


const LogoutButton = styled.button`
        white-space: nowrap;
        min-width: 75px;
        background-color: #ff5d5dcf;
        border: 1px solid;
    `;
const LoggedInButton = styled.button`
white-space: nowrap;
min-width: 75px;
background-color: #98ff5dcf;
border: 1px solid;
`;
export default Header;