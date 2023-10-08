import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { customAxios } from "../../../utils/axios/customAxios";
import { ModalPage } from "../../pages";
import {
  ButtonContainer,
  ContentChangeButton,
  HeaderButtonContainer,
  HeaderContainer,
  HeaderContent,
  LoginButton,
  LogoutButton,
} from "./style";
import { faUser, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { isLogin } from "../../../store/slices/userSlice";

const Header = () => {
  const reactLocation = useLocation();

  const login = useSelector((state: RootState) => {
    return state.user.islogin;
  });

  const dispach = useDispatch();
  const loginHandle = {
    login: () => {
      dispach(isLogin(true));
      return true;
    },
    logout: () => {
      dispach(isLogin(false));
      return false;
    },
  };

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
  const navigate = useNavigate();
  const navUserInfo = () => {
    navigate("/me");
  };
  const navMain = () => {
    navigate("/");
  };
  const MypageButton = () => {
    return (
      <ContentChangeButton onClick={navUserInfo}>
        <FontAwesomeIcon
          className="mr-1"
          icon={faUser}
          size="1x"
        ></FontAwesomeIcon>
        내정보
      </ContentChangeButton>
    );
  };
  const MainButton = () => {
    return (
      <ContentChangeButton onClick={navMain}>
        <FontAwesomeIcon
          className="mr-1"
          icon={faBookmark}
          size="1x"
        ></FontAwesomeIcon>
        북마크
      </ContentChangeButton>
    );
  };
  const sendLogout = async () => {
    await customAxios.get(`/user/logout`);
    localStorage.removeItem("accessToken");
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };
  const deleteLocalUserData = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };
  const onLogout = async () => {
    deleteLocalUserData();
    localStorage.removeItem("accessToken");
    await sendLogout();
    loginHandle.logout();
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };
  const ButtonHandle = () => {
    const isMainPage = reactLocation.pathname === "/" ? true : false;
    return isMainPage ? <MypageButton /> : <MainButton />;
  };

  const loginedHeader = () => {
    return (
      <HeaderContainer id="header">
        <div></div>
        {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
        <HeaderContent>
          <div className="title">Tag Mark</div>
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
    );
  };

  const unLoginHeader = () => {
    return (
      <HeaderContainer id="header">
        <div></div>
        {useModal.isShowModal ? <ModalPage useModal={useModal} /> : null}
        <HeaderContent>
          <div>Tag Mark</div>
          <div></div>
          <HeaderButtonContainer>
            <LoginButton onClick={onlogin}>로그인</LoginButton>
          </HeaderButtonContainer>
        </HeaderContent>
        <div></div>
      </HeaderContainer>
    );
  };

  const onlogin = () => {
    useModal.openModal();
  };

  // useEffect(() => {
  //     setIsLogin(props.isLogin)
  // }, []);

  return login ? loginedHeader() : unLoginHeader();
};

export default Header;
