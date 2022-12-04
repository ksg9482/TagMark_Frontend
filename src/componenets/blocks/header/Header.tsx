import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { customAxios } from '../../../utils/axios/customAxios';
import { ModalPage } from '../../pages';
import { HeaderContainer } from './style';



const Header = (props: any) => {
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(false)

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
                마이
            </button>
        )
    }
    const MainButton = () => {
        return (
            <button onClick={navMain}>
                메인
            </button>
        )
    }
    const sendLogout = async () => {
        //서버요청
        try {
            await customAxios.get(`/user/logout`);
        console.log('로그아웃 응답 반환')
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
    }
    const ButtonHandle = () => {
        const isMainPage = location.pathname === '/' ? true : false
        return isMainPage ? <MypageButton /> : <MainButton />
    }
    const loginedHeader = () => {

        return (
            <HeaderContainer>
                {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
                <span>Logined Header</span>
                <span>태그검색가능</span>
                <span>{ButtonHandle()}</span>
                <span onClick={onLogout}>로그인 토글 ON</span>
            </HeaderContainer>
        )
    }
    const unLoginHeader = () => {
        return (
            <HeaderContainer>
                {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
                <span>Unlogin Header</span>
                <span>태그검색불가</span>
                <button onClick={onlogin}>로그인/회원가입</button>
                <span>로그인 토글 OFF</span>
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