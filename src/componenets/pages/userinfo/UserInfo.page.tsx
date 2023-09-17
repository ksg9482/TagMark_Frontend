import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { customAxios } from "../../../utils/axios/customAxios";
import { secure } from "../../../utils/secure";
import { LoadingBar } from "../../blocks/common/loading/loading";
import { MyResponsivePie } from "../../blocks/userInfo/tagGraph";
import { UserInfoModalPage } from "../modal/UserInfoModalPage";
import { BookmarkAreaContainer, CommonButton, GraphContainer, MyDataButtonContainer, MyDataContainer, MyInfoContainer, SubContainer, TagAreaContainer, UserInfoContainer } from "./style";

export const UserInfo = () => {
    const secureWrap = secure().wrapper()
    const [userInfo, setUserInfo] = useState({ email: '', nickname: '', type: '', bookmarkCount: 0, tagCount: 0 })
    const [tagGraphData, setTagGraphData] = useState([{
        id: '없음',
        label: '없음',
        value: 1
    }])

    const [load, setLoad] = useState(true);
    const [errorMessage, setErrorMessage] = useState('')

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
    
        const modalPage = () => {
            return <UserInfoModalPage useModal={useModal} contentKey={contentKey} userData={userInfo} sendEditUserData={sendEditUserData} sendDeleteUser={sendDeleteUser} errorMessage={errorMessage} />
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

    const updateTagGraphData = (tagGraphData: any) => {
        setTagGraphData(tagGraphData)
    }
    const updateErrorMessage = (message: string) => {
        setErrorMessage(message)
    };
    const getUserInfo = async () => {
        setLoad(true);
        const userInfo = await sendGetUserInfo();
        const bookmarkCount = await sendGetBookmarkCount()
        const tagCount = await sendGetTagCount()
        const graphData = tagCount.data.tags.map((tag: any) => {
            return {
                id: tag.tag,
                label: tag.tag,
                value: tag.count
            }
        })
        const user = userInfo.data.user;

        updateUserInfo({ email: user.email, nickname: user.nickname, type: user.type, bookmarkCount: bookmarkCount.data.count, tagCount: tagCount.data.tags.length })
        updateTagGraphData(graphData)

        setLoad(false);
    }
    const sendEditUserData = async (editUser: any) => {
        try {
            await customAxios.patch(`/user`, editUser)
            setUserInfo((oldUserInfo) => { return { ...oldUserInfo, nickname: secureWrap.decryptWrapper(editUser.nickname) } })
        } catch (error) {
            updateErrorMessage('유저 정보 업데이트에 실패했습니다.')
        }
    }
    const deletePasswordCheck = async (password: string) => {
        const result = await customAxios.post(`/user/valid`, { password })
        return result.data.valid
    }
    const sendDeleteUser = async (password: string) => {
        if (!await deletePasswordCheck(password) && userInfo.type === 'BASIC') {
            updateErrorMessage('비밀번호가 다릅니다.')
            return { error: '비밀번호가 다릅니다.' }
        }
        await customAxios.delete(`/user`)
        return { message: 'deleted' }
    }
    useEffect(() => {
        getUserInfo()
    }, [])

    const UserInfoContent = () => {
        return (
            <UserInfoContainer id="user-info">
                <Helmet>MyPage | TAG-MARK</Helmet>
                {useModal.isShowModal ? modalHandle.modalPage() : null}
                <BookmarkAreaContainer className="bookmark-area">
                    <div>총 북마크 개수 : {userInfo.bookmarkCount} </div>
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
        load ? <Loading /> : <UserInfoContent />
    )
}
