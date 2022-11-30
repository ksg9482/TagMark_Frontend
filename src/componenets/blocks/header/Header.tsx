import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ModalPage } from '../../pages';
import { HeaderContainer } from './style';



const Header = (props:any) => {
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
    const loginedHeader = () => {
        return (
            <HeaderContainer>
            {useModal.isShowModal ? <ModalPage useModal={useModal}/>: null}
            <span>Logined Header</span>
            <span>태그검색가능</span>
            <span>{ButtonHandle()}</span>
            <button>로그인 토글 ON</button>
        </HeaderContainer>
        )
    }
    const unLoginHeader = () => {
        return (
            <HeaderContainer>
            {useModal.isShowModal ? <ModalPage useModal={useModal}/>: null}
            <span>Unlogin Header</span>
            <span>태그검색불가</span>
            <button onClick={onlogin}>로그인/회원가입</button>
            <span>{ButtonHandle()}</span>
            <button>로그인 토글 OFF</button>
        </HeaderContainer>
        )
    }
    const onlogin = () => {
        useModal.openModal();
    }
    useEffect(()=>{
        setIsLogin(props.isLogin)
    },[])
    //이것도 컴포넌트로 만들어서 컴포넌트 반환하게 통일
    return isLogin? loginedHeader() : unLoginHeader()
};



export default Header;