import styled from "styled-components";
import { CommonButtonContainer, OauthButtonContainer } from "./styles";

export const OAuthButtonBlock = (props: any) => {
    const oauthGoogle = props.oauthGoogle
    const oauthKakao = props.oauthKakao
    return (
        <OauthButtonContainer>
            <OAuthButton onClick={oauthGoogle}>
                <Img
                    src="Social-google.png"
                    alt="social"
                />
                <span>GOOGLE 아이디로 로그인</span>
            </OAuthButton>
            <OAuthButton onClick={oauthKakao}>
                <Img
                    src="Social-kakao.png"
                    alt="social"
                />
                <span>KAKAO 아이디로 로그인</span>
            </OAuthButton>
        </OauthButtonContainer>
    )
};
const Img = styled.img`
height: 30px;
width: auto;
`;

const OAuthButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

display: grid;
grid-template-columns: auto auto;
align-items: center;
justify-items: center;
max-height: fit-content;
gap: 5px;

margin: 0;
  padding: 0.2rem 0.5rem;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;
  width: auto;
  min-width: 240px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  transition: 0.2s;
  background-color: #ffffff;
  &:hover {
    background-color: #f0f0f0;
  }
`;