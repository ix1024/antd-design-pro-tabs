import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { FormattedMessage } from 'umi-plugin-react/locale';
import { Card, Typography } from 'antd';
import styles from './Welcome.less';
import { openPage } from '@/utils/utils';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default () => (
  <PageHeaderWrapper>

    <Card title="基于Ant Design Pro 二次开发，实现支持多Tabs标签页面">

      <h2>支持打开第三方页面</h2>

      <CodePreview>{

        `import {openPage} from '@/utils/utils';

<div onClick={() => {
  openPage({ id: 'baidu', title: 'Google', url: 'https://google.com/' })
}}>Google</div>


      `}
      </CodePreview>

      <div onClick={() => {
        openPage({ id: 'Github', title: 'Github', url: 'http://github.com/' })
      }}>打开Github</div>
      <div onClick={() => {
        openPage({ id: 'baidu', title: 'Google', url: 'http://google.com/' })
      }}>打开Google</div>
      <div onClick={() => {
        openPage({ id: 'Antd', title: 'Antd', url: 'http://3x.ant.design/index-cn' })
      }}>打开Antd</div>
      <div onClick={() => {
        openPage({ id: 'mobile', title: 'Antd', url: 'https://mobile.ant.design/index-cn' })
      }}>打开Antd mobile</div>
    </Card>

  </PageHeaderWrapper>
);
