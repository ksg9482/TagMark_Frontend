import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { customAxios } from '../../../utils/axios/customAxios';
import { ModalPage } from '../../pages';
import { ButtonContainer, ContentChangeButton, HeaderButtonContainer, HeaderContainer, HeaderContent, LogoutButton } from './style';
import { faUser, faBookmark } from '@fortawesome/free-solid-svg-icons';



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
            <ContentChangeButton onClick={navUserInfo}>
                <FontAwesomeIcon className="mr-1" icon={faUser} size='1x'></FontAwesomeIcon>
                내정보
            </ContentChangeButton>
        )
    }
    const MainButton = () => {
        return (
            <ContentChangeButton onClick={navMain}>
                <FontAwesomeIcon className="mr-1" icon={faBookmark} size='1x'></FontAwesomeIcon>
                북마크
            </ContentChangeButton>
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

        const Logout = () => {
            return (
                <LogoutButton onClick={onLogout} onMouseOut={() => setlogoutFocused(false)}>
                    Log Out
                </LogoutButton>
            )
        };

        //그냥 로그아웃, 로그인중 버튼은 따로 만들어서 쓰자. 내용이랑 색이랑 따로논다.
        return (
            <HeaderContainer id='header'>
                <div></div>
                {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
                <HeaderContent>
                    <div className='title'>Tag Mark</div>
                    <div></div>
                    <ButtonContainer>
                        <HeaderButtonContainer>{ButtonHandle()}</HeaderButtonContainer>
                        <HeaderButtonContainer>
                            <LogoutButton onClick={onLogout}>LogOut</LogoutButton>
                        </HeaderButtonContainer>
                    </ButtonContainer>
                </HeaderContent>
                <div></div>
            </HeaderContainer>

        )
    }
    
    const unLoginHeader = () => {
        return (
            <HeaderContainer id='header'>
                <div></div>
                {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
                <HeaderContent>
                    <div>Tag Mark</div>
                    <div></div>
                    <HeaderButtonContainer>
                        <ContentChangeButton onClick={onlogin}>로그인</ContentChangeButton>
                    </HeaderButtonContainer>
                </HeaderContent>
                <div></div>
            </HeaderContainer>
        )
    };

    const onlogin = () => {
        useModal.openModal();
    };

    useEffect(() => {
        setIsLogin(props.isLogin)
    }, []);

    //이것도 컴포넌트로 만들어서 컴포넌트 반환하게 통일
    return isLogin ? loginedHeader() : unLoginHeader()
};


//기본은 파란 프레임만 보이는 디자인. 마우스 대면 하얀 바탕을 빨갛게 채우고 글자색 바뀜

export default Header;