import React from "react";
import { useSelector } from "react-redux";
import { typingtestSelectors } from "./typingtestSlice";

const ZhZi = ({ ziId, zi = null, status = null }) => {
  const ziObj = useSelector((state) =>
    typingtestSelectors["zh"].selectById(state, ziId)
  );
  return (
    <div className="zhzi" status={status === null ? ziObj.status : status}>
      {zi === null ? ziObj.zi : zi}
    </div>
  );
};

export default ZhZi;
