// @flow

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, Icon } from "antd";
import styled from "styled-components";

const FixedSection = styled.section`
  position:fixed;
  bottom:5em;
  right:5em;
  
  > .ant-btn{
    
    height:50px;
    width:50px;
    font-size:1.5em;

  }
`;

/**
 * Description 刷新按钮
 */
export default class ReloadButton extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired
  };

  render() {
    return (
      <FixedSection>
        <Button
          onClick={this.props.onClick}
          shape="circle"
          size="large"
          type="primary"
        >
          <Icon type="reload" />
        </Button>
      </FixedSection>
    );
  }
}
