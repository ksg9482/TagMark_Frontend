export const OAuthButtonBlock = (props:any) => {
    const oauthGoogle = props.oauthGoogle
    const oauthKakao = props.oauthKakao
    return (
        <div>
            <button onClick={oauthGoogle}>구글</button>
            <button onClick={oauthKakao}>카카오</button>
        </div>
    )
};