import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { ModalPage } from '../../pages';

export interface UseModal {
    isShowModal: boolean;
    openModal:Function;
    closeModal:Function;
    toggleModal:Function;
};

const Header = () => {
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
    const onlogin = () => {
        useModal.openModal();
    }
    return (
        <HeaderContainer>
            {useModal.isShowModal ? <ModalPage useModal={useModal}/>: null}
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