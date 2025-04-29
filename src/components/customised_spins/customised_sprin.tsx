import React from 'react';
import { Spin } from 'antd';
import { Flex } from 'antd';

const contentStyle = {
  padding: 50,
  background: 'white',
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

const CustomSpin = () => (
    <Spin tip="Loading" size="large">
      {content}
    </Spin>
);

export default CustomSpin;
