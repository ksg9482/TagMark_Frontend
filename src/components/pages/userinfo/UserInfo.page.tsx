import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  updateNickname,
  updateType,
  updateId,
  updateEmail,
  updateBookmarkCount,
  updateTagCount,
} from "../../../store/slices/userSlice";
import { customAxios } from "../../../utils/axios/customAxios";
import { secure } from "../../../utils/secure";
import { LoadingBar } from "../../common/loading";
import { MyResponsivePie } from "../../blocks/userInfo/tagGraph";
import { UserInfoModalPage } from "../modal/UserInfoModalPage";
import {
  BookmarkAreaContainer,
  GraphContainer,
  MyDataButtonContainer,
  MyDataContainer,
  MyInfoContainer,
  SubContainer,
  TagAreaContainer,
  UserInfoContainer,
} from "./style";
import { CommonButton } from "../../common/style";

interface UserInfo {
  email: string;
  nickname: string;
  type: string;
  bookmarkCount: number;
  tagCount: number;
}
export const UserInfo = () => {
  const dispach = useDispatch();
  const newUserInfo = useSelector((state: RootState) => {
    return {
      email: state.user.email,
      nickname: state.user.nickname,
      type: state.user.type,
      bookmarkCount: state.user.bookmarkCount,
      tagCount: state.user.tagCount,
    };
  });
  const userInfoHandle = {
    updateId: (id: string) => {
      dispach(updateId(id));
      return true;
    },
    updateEmail: (email: string) => {
      dispach(updateEmail(email));
      return email;
    },
    updateNickname: (nickname: string) => {
      dispach(updateNickname(nickname));
      return nickname;
    },
    updateType: (type: string) => {
      dispach(updateType(type));
      return type;
    },
    updateBookmarkCount: (bookmarkCount: number) => {
      dispach(updateBookmarkCount(bookmarkCount));
      return bookmarkCount;
    },
    updateTagCount: (tagCount: number) => {
      dispach(updateTagCount(tagCount));
      return tagCount;
    },
    updateUserInfo: (userInfo: UserInfo) => {
      const { email, nickname, type, bookmarkCount, tagCount } = userInfo;
      dispach(updateEmail(email));
      dispach(updateNickname(nickname));
      dispach(updateType(type));
      dispach(updateBookmarkCount(bookmarkCount));
      dispach(updateTagCount(tagCount));
      return tagCount;
    },
  };
  const secureWrap = secure().wrapper();
  const [tagGraphData, setTagGraphData] = useState([
    {
      id: "없음",
      label: "없음",
      value: 1,
    },
  ]);

  const [load, setLoad] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const UseModal = () => {
    const [isShowModal, setIsShowModal] = useState(false);

    const openModal = useCallback(() => {
      setIsShowModal(true);
    }, [setIsShowModal]);

    const closeModal = useCallback(() => {
      setIsShowModal(false);
    }, [setIsShowModal]);

    const toggleModal = useCallback(() => {
      setIsShowModal((prev) => !prev);
    }, [setIsShowModal]);

    return { isShowModal, openModal, closeModal, toggleModal };
  };
  const useModal = UseModal();

  const ModalHandle = () => {
    const [contentKey, setContentKey] = useState("edit");

    const modalPage = () => {
      return (
        <UserInfoModalPage
          useModal={useModal}
          contentKey={contentKey}
          sendEditUserData={sendEditUserData}
          sendDeleteUser={sendDeleteUser}
          errorMessage={errorMessage}
        />
      );
    };
    const openModal = (key: "edit" | "delete") => {
      setContentKey(key);
      useModal.openModal();
    };

    return {
      modalPage,
      openModal,
    };
  };
  const modalHandle = ModalHandle();

  const sendGetUserInfo = async () => {
    return await customAxios.get(`/user`);
  };
  const sendGetBookmarkCount = async () => {
    return await customAxios.get(`/bookmark/count`);
  };
  const sendGetTagCount = async () => {
    return await customAxios.get(`/tag`);
  };

  const updateTagGraphData = (tagGraphData: any) => {
    setTagGraphData(tagGraphData);
  };
  const updateErrorMessage = (message: string) => {
    setErrorMessage(message);
  };
  const getUserInfo = async () => {
    setLoad(true);
    let userInfo = await sendGetUserInfo();
    let bookmarkCount = await sendGetBookmarkCount();
    let tagCount = await sendGetTagCount();

    const graphData = tagCount.data.tags.map((tag: any) => {
      return {
        id: tag.tag,
        label: tag.tag,
        value: tag.count,
      };
    });
    const user = userInfo.data.user;

    userInfoHandle.updateUserInfo({
      email: user.email,
      nickname: user.nickname,
      type: user.type,
      bookmarkCount: bookmarkCount.data.count,
      tagCount: tagCount.data.tags.length,
    });
    updateTagGraphData(graphData);

    setLoad(false);
  };
  const sendEditUserData = async (editUser: any) => {
    try {
      await customAxios.patch(`/user`, editUser);
      userInfoHandle.updateUserInfo({
        ...newUserInfo,
        nickname: secureWrap.decryptWrapper(editUser.nickname),
      });
    } catch (error) {
      updateErrorMessage("유저 정보 업데이트에 실패했습니다.");
    }
  };
  const deletePasswordCheck = async (password: string) => {
    const result = await customAxios.post(`/user/valid`, { password });
    return result.data.valid;
  };
  const sendDeleteUser = async (password: string) => {
    if (
      !(await deletePasswordCheck(password)) &&
      newUserInfo.type === "BASIC"
    ) {
      updateErrorMessage("비밀번호가 다릅니다.");
      return { error: "비밀번호가 다릅니다." };
    }
    await customAxios.delete(`/user`);
    return { message: "deleted" };
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  const BookmarkCountBlock = () => {
    return (
      <div>총 북마크 개수 : {newUserInfo.bookmarkCount} </div>
    )
  }
  const TagGraphBlock = () => {
    return (
      <TagAreaContainer className="tag-area">
        <div>총 태그 개수 : {newUserInfo.tagCount}</div>
        <GraphContainer className="graph_con">
          {MyResponsivePie(tagGraphData)}
        </GraphContainer>
      </TagAreaContainer>
    )
  }
  const MyDataManageBlock = () => {
    return (<MyDataContainer className="userinfo-area">
      <div>내 정보</div>
      <MyInfoContainer>
        <div className="email-info">
          <div>이메일 : {newUserInfo.email}</div>
          {newUserInfo.type !== "BASIC" ? (
            <div>소셜로그인입니다</div>
          ) : (
            <div>&nbsp;</div>
          )}
        </div>
        <div>닉네임 : {newUserInfo.nickname}</div>
      </MyInfoContainer>
      <MyDataButtonContainer>
        <CommonButton
          className="edit-button"
          onClick={(e) => modalHandle.openModal("edit")}
        >
          정보변경{" "}
        </CommonButton>
        <CommonButton
          className="delete-button"
          onClick={(e) => modalHandle.openModal("delete")}
        >
          회원탈퇴{" "}
        </CommonButton>
      </MyDataButtonContainer>
    </MyDataContainer>)
  }
  const UserInfoContent = () => {
    return (
      <UserInfoContainer id="user-info">
        <Helmet>MyPage | TAG-MARK</Helmet>
        {useModal.isShowModal ? modalHandle.modalPage() : null}
        <BookmarkAreaContainer className="bookmark-area">
          <BookmarkCountBlock />
        </BookmarkAreaContainer>
        <SubContainer id="sub-container">
          <TagGraphBlock />
          <MyDataManageBlock />
        </SubContainer>
      </UserInfoContainer>
    );
  };

  const Loading = () => {
    return <LoadingBar />;
  };

  return load ? <Loading /> : <UserInfoContent />;
};
