const Header = () => {
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
    return (
        <div>
            <span>Header Block</span> 
            <span>로그인시만 가능 - 태그검색</span>
            <span>{ButtonHandle()}</span>
            <button>로그아웃</button>
        </div>
    )
}

export default Header