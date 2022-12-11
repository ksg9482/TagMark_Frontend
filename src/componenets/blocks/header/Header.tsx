import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { customAxios } from '../../../utils/axios/customAxios';
import { ModalPage } from '../../pages';
import { HeaderContainer } from './style';



const Header = (props: any) => {
    const reactLocation = useLocation()
    const [isLogin, setIsLogin] = useState(false)
    const [focused, setFocused] = useState(false);

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
            <button onClick={navUserInfo}>
                내정보
            </button>
        )
    }
    const MainButton = () => {
        return (
            <button onClick={navMain}>
                북마크
            </button>
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
    const LogoutToggle = styled.div`
    border: 1px solid;
    background-color: #98ff5dcf;
    white-space: nowrap;
    width: fit-content;
    padding-left: 4px;
    padding-right: 4px;
    :hover {
        background-color: #ff5d5dcf;
    }
    `;
    const loginedHeader = () => {

        return (

            <HeaderContainer>
                <div></div>
                {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
                <HeaderContent>
                    <div>Tag Mark</div>
                    <div></div>
                    <div>{ButtonHandle()}</div>
                    <LogoutToggle onClick={onLogout} onMouseOver={() => setFocused(true)} onMouseOut={() => setFocused(false)}>{focused ? 'Logout' : 'Logged In'}</LogoutToggle>
                </HeaderContent>
                <div></div>
            </HeaderContainer>

        )
    }
    const HeaderContent = styled.div`
        display: grid;
        grid-template-columns: 20% 50% 20% 10%;
    `;
    const unLoginHeader = () => {
        return (
            <HeaderContainer>
                <div></div>
                {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
                <HeaderContent>
                    <div>Tag Mark</div>
                    <div></div>
                    <button onClick={onlogin}>로그인</button>
                    <div>Local</div>
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



export default Header;