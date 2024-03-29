import { useEffect, useState } from "react";
import { Bookmark } from "../../../interface/bookmark";
import { Tag, TagCountObj } from "../../../interface/tag";
import { customAxios } from "../../../utils/axios/customAxios";
import { secure } from "../../../utils/secure";
import {
  CountContainer,
  SideBarContainer,
  SideBarInput,
  SideBarTagComponent,
  SideBarTagsContainer,
  SideBarTextContainer,
  TagNameContainer,
} from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { CommonButton } from "../../common/style";

const SideBarTagComponenet = (props: any) => {
  const getTagBookmarkSideBar = props.getTagBookmarkSideBar;
  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const targetTagName = e.currentTarget.querySelector(".tag_name")?.innerHTML;
    getTagBookmarkSideBar([targetTagName], "origin");
  };
  const tag: TagCountObj = props.tagWithCount;

  return (
    <SideBarTagComponent onClick={onClick}>
      <TagNameContainer className="tag_name">{tag.tag}</TagNameContainer>
      <CountContainer>{tag.count}</CountContainer>
    </SideBarTagComponent>
  );
};

const SideBarTags = (props: any) => {
  const tagCountObjArr: TagCountObj[] = props.tagCountObjArr;

  return (
    <SideBarTagsContainer>
      {tagCountObjArr.map((tag) => (
        <SideBarTagComponenet
          tagWithCount={tag}
          key={tag.tag}
          getTagBookmarkSideBar={props.getTagBookmarkSideBar}
        />
      ))}
    </SideBarTagsContainer>
  );
};

const SideBar = (props: any) => {
  const isLogin = useSelector((state: RootState) => {
    return state.user.islogin;
  });
  const originBookmarks = useSelector((state: RootState) => {
    return state.bookmark.originBookmarks;
  });
  const [tagObj, setTagObj] = useState({
    init: {
      id: 0,
      tag: "",
      count: 0,
    },
  });
  const [tagWithCounts, setTagWithCounts] = useState([
    {
      id: 0,
      tag: "",
      count: 0,
    },
  ]);
  const [tagInput, setTagInput] = useState("");
  const createLocalTagArr = (localBookmarks: Bookmark[]) => {
    return localBookmarks
      .map((localBookmark) => {
        return localBookmark.tags;
      })
      .flat();
  };
  /**
   * @returns {
   *  tag:{
   *      id: string,
   *      tag: string,
   *      count: number
   *  }}
   */
  const createTagObj = (tags: Tag[]) => {
    let result: any = {};
    tags.forEach((tag) => {
      result[tag.tag] = { ...tag, count: (result[tag.tag]?.count || 0) + 1 };
    });
    return result;
  };
  const setTagCount = (tagobj: any) => {
    let resultArr: TagCountObj[] = [];
    for (let key in tagobj) {
      resultArr.push(tagobj[key]);
    }
    return resultArr;
  };

  const sendGetTagCount = async () => {
    return await customAxios.get(`/tag`);
  };
  const getTags = async (isLogin: boolean) => {
    if (!isLogin) {
      const localBookmarks: Bookmark[] = JSON.parse(
        secure().local().getItem("local-bookmark-storage")!
      );

      const localTagArr: Tag[] = createLocalTagArr(localBookmarks);
      const createdTagObj = createTagObj(localTagArr);
      setTagObj(createdTagObj);
      const tagCountObjArr = setTagCount(createdTagObj);
      return setTagWithCounts(tagCountObjArr);
    } else {
      const tagData = await sendGetTagCount();
      const tempForm = tagData.data.tags.map((tag: any) => {
        return { ...tag, tag: tag.tag };
      });
      setTagObj(tempForm);
      return setTagWithCounts(tempForm);
    }
  };

  const tagSearch = (tagObj: any, tagInput: string): TagCountObj[] => {
    const result: TagCountObj[] = [];

    for (let tag in tagObj) {
      const tagName: string = tagObj[tag].tag;
      if (tagName.includes(tagInput)) {
        result.push(tagObj[tag]);
      }
    }
    setTagWithCounts(result);
    return result;
  };

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const inputRefresh = () => {
    const inputValue: any = document.getElementById("side_bar_input")!;
    inputValue.value = "";
    setTagInput("");
  };
  const tagSearchRefresh = () => {
    const originTagObj = setTagCount(tagObj);
    inputRefresh();
    setTagWithCounts(originTagObj);
  };

  useEffect(() => {
    tagSearch(tagObj, tagInput);
  }, [tagInput]);
  useEffect(() => {
    getTags(isLogin);
  }, [originBookmarks]);

  return (
    <SideBarContainer>
      <SideBarTextContainer>
        <div>태그검색</div>
        <CommonButton onClick={tagSearchRefresh}>
          <FontAwesomeIcon
            className="mr-1"
            icon={faArrowsRotate}
            size="1x"
          ></FontAwesomeIcon>
        </CommonButton>
      </SideBarTextContainer>
      <SideBarInput
        type="text"
        id="side_bar_input"
        defaultValue={tagInput}
        onChange={inputOnChange}
      />
      <SideBarTags
        tagCountObjArr={tagWithCounts}
        getTagBookmarkSideBar={props.getTagBookmarkSideBar}
      />
    </SideBarContainer>
  );
};

export default SideBar;
