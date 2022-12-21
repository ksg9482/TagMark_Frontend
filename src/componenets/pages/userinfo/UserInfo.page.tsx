import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { customAxios } from "../../../utils/axios/customAxios";
import { secure } from "../../../utils/secure";
import { LoadingBar } from "../../blocks/common/loading/loading";
import { MyResponsivePie } from "../../blocks/userInfo/tagGraph";
import { UserInfoModalPage } from "../modal/UserInfoModalPage";
import { BookmarkAreaContainer, CommonButton, GraphContainer, MyDataButtonContainer, MyDataContainer, MyInfoContainer, SubContainer, TagAreaContainer, UserInfoContainer } from "./style";

export const UserInfo = () => {
    const secureWrap = secure().wrapper()
    const [userInfo, setUserInfo] = useState({ email: '', nickname: '', type: '', bookmarkCount: 0, tagCount: 0 })
    const [tagCount, setTagCount] = useState([{ id: 0, tag: '', count: '' }])
    const [tagGraphData, setTagGraphData] = useState([{
        id: '없음',
        label: '없음',
        value: 1
    }])

    const [load, setLoad] = useState(true);

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

    const ModalHandle = () => {
        const [contentKey, setContentKey] = useState('edit')
        const [modalContent, setModalContent] = useState(<UserInfoModalPage useModal={useModal} content={contentKey} />)

        const modalPage = () => {
            //전송함수 묶어서 보내기 데이터랑 함수 단위로 하나로 묶어 보내는게 좋지 않을까? 인터페이스 만들기도 편하고
            return <UserInfoModalPage useModal={useModal} contentKey={contentKey} userData={userInfo} sendEditUserData={sendEditUserData} sendDeleteUser={sendDeleteUser} />
        }
        const openModal = (key: 'edit' | 'delete') => {
            setContentKey(key)
            useModal.openModal()
        }

        return {
            modalPage, openModal
        }
    }
    const modalHandle = ModalHandle()
    const updateUserInfo = (userInfo: any) => {
        setUserInfo(userInfo)
    }
    const sendGetUserInfo = async () => {
        return await customAxios.get(`/user`)
    }
    const sendGetBookmarkCount = async () => {
        return await customAxios.get(`/bookmark/count`)
    }
    const sendGetTagCount = async () => {
        return await customAxios.get(`/tag`)
    }
    //객체 내용물을 재귀를 통해 암호화함
    const encryptWrapper = (data: any) => {

    }
    const updateTagCount = (tagCount: any) => {
        setTagCount(tagCount)
    }
    const updateTagGraphData = (tagGraphData: any) => {
        setTagGraphData(tagGraphData)
    }
    const getUserInfo = async () => {
        try {
            const userInfo = await sendGetUserInfo(); //암호문
            const bookmarkCount = await sendGetBookmarkCount()
            const tagCount = await sendGetTagCount()
            const graphData = tagCount.data.tags.map((tag: any) => {
                return {
                    id: tag.tag,
                    label: tag.tag,
                    value: tag.count
                }
            })
            const user = JSON.parse(secureWrap.decryptWrapper(userInfo.data.user))
            encryptWrapper('')
            updateUserInfo({ email: user.email, nickname: user.nickname, type: user.type, bookmarkCount: bookmarkCount.data.count, tagCount: tagCount.data.tags.length })
            updateTagCount(tagCount.data.tags)
            updateTagGraphData(graphData)

            setLoad(false);

        } catch (error) {
            console.log(error)
        }
    }
    const sendEditUserData = async (editUser: any) => {
        try {
            const encrypted = secureWrap.encryptWrapper('test')
            const userInfo = await customAxios.patch(`/user`, editUser)
        } catch (error) {
            console.log(error)
        }
    }
    const deletePasswordCheck = async (password: string) => {
        const result = await customAxios.post(`/user/valid`, { password })
        return result.data.valid
    }
    const sendDeleteUser = async (password: string) => {
        //비번검사 거친다
        if (!await deletePasswordCheck(password)) {
            return '비밀번호 다름 에러'
        }
        return;
        const userInfo = await customAxios.delete(`/user`)
    }
    useEffect(() => {
        getUserInfo()
    }, [])

    const UserInfoContent = () => {
        return (
<UserInfoContainer id="user-info">
            {useModal.isShowModal ? modalHandle.modalPage() : null}
            <BookmarkAreaContainer className="bookmark-area">
                <div>총 북마크 개수 : {userInfo.bookmarkCount} </div>
                {/* <div>북마크 DB 동기화 (자동 on/off) </div>
                <button>북마크 가져오기 </button>
                <button>내 북마크 공유하기 </button> */}
            </BookmarkAreaContainer>
            <SubContainer id="sub-container">
                <TagAreaContainer className="tag-area">
                    <div>총 태그 개수 : {userInfo.tagCount}</div>
                    <GraphContainer className="graph_con">{MyResponsivePie(tagGraphData)}</GraphContainer>
                </TagAreaContainer>
                <MyDataContainer className="userinfo-area">
                    <div>내 정보</div>
                    <MyInfoContainer>
                        <div className="email-info">
                            <div>이메일 : {userInfo.email}</div>
                            {userInfo.type !== 'BASIC' ? <div>소셜로그인입니다</div> : <div>&nbsp;</div>}
                        </div>
                        <div>닉네임 : {userInfo.nickname}</div>
                    </MyInfoContainer>
                    <MyDataButtonContainer>
                        <CommonButton className="edit-button" onClick={e => modalHandle.openModal('edit')}>정보변경 </CommonButton>
                        <CommonButton className="delete-button" onClick={e => modalHandle.openModal('delete')}>회원탈퇴 </CommonButton>
                    </MyDataButtonContainer>
                </MyDataContainer>
            </SubContainer>
        </UserInfoContainer>
        )
    };

    const Loading = () => {
        return (
            <LoadingBar />
        )
    };

    return (
        load ? <Loading/> : <UserInfoContent />
    )
}

//export default BookMark