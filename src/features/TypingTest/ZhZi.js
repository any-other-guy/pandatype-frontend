import React from "react";
import { useSelector } from "react-redux";
import { typingtestSelectors } from "./typingtestSlice";

const ZhZi = ({ ziId, status = null }) => {
  const ziObj = useSelector((state) =>
    typingtestSelectors["zh"].selectById(state, ziId)
  );
  return (
    <div className="zhzi" status={status === null ? status : ziObj.status}>
      {ziObj.zi}
    </div>
  );
};

export default ZhZi;
