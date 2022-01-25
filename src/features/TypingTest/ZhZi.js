import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { typingtestSelectors } from './typingtestSlice';

const ZhZi = ({ ziId = null, zi = null, status = null }) => {
  const ziObj = useSelector((state) => typingtestSelectors.zh.selectById(state, ziId));
  return (
    <div className="zhzi" status={status === null ? ziObj.status : status}>
      {zi === null ? ziObj.zi : zi}
    </div>
  );
};

ZhZi.propTypes = {
  ziId: PropTypes.string,
  zi: PropTypes.string,
  status: PropTypes.string,
};

ZhZi.defaultProps = {
  ziId: null,
  zi: null,
  status: null,
};

export default ZhZi;
