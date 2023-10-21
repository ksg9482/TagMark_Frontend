import { useSelector } from "react-redux";
import { MyResponsivePie } from "./tagGraphContent";
import { RootState } from "../../../store";
import { GraphContainer, TagAreaContainer } from "./style";

export const TagGraphBlock = (props: any) => {
  const myInfo = useSelector((state: RootState) => {
    return {
      tagCount: state.user.tagCount,
    };
  });
  return (
    <TagAreaContainer className="tag-area">
      <div>총 태그 개수 : {myInfo.tagCount}</div>
      <GraphContainer className="graph_con">
        {MyResponsivePie(props.tagGraphData)}
      </GraphContainer>
    </TagAreaContainer>
  );
};
