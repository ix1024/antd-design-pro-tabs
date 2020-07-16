/**
 * @name 标签页组件
 * @Author hz16042180
 * @Date 2019-11-13
 * @param children {ReactElement} umi框架中page目录下的页面组件
 * @example
 *   import PageTab from '@/layouts/PageTab';
 *   <PageTab>{children}</PageTab>
 */

import { connect } from 'dva';
import router from 'umi/router';
import React, { Component } from 'react';
import { message, Tabs, Menu, Dropdown, Tooltip, Icon } from 'antd';
import DraggableTabs from './DraggableTabs';
import pageTabStyle from './PageTab.less';

const { TabPane } = Tabs;
const TABS_NOT_TIPS = 'TABS_NOT_TIPS';


const getTitle = (cb = () => { }) => {
  return localStorage.getItem(TABS_NOT_TIPS) ? (
    undefined
  ) : (
      <div style={{ fontSize: 14, width: 380 }}>
        <div>1、点击鼠标右键可以操作标签页面；</div>
        <div>
          2、双击标签页标题可以刷新当前页； 我已知道，
        <span
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => {
              message.success('操作成功，已不再提示');

              localStorage.setItem(TABS_NOT_TIPS, true);
              cb();
            }}
          >
            不再提示
        </span>
        </div>
      </div>
    );
};

const menu = obj => {
  const { pane = {}, pages = [], reflash = () => { }, closeOhterTabs = () => { } } = obj;
  const { key, title } = pane;
  let leftDisabled = false;
  let rightDisabled = false;
  pages.forEach((item, index) => {
    if (item.key === key) {
      if (index > pages.length - 2) {
        rightDisabled = true;
      }
      if (index === 0) {
        leftDisabled = true;
      }
    }
  });
  return (
    <Menu style={{ marginTop: 8 }}>
      <Menu.Item
        // onContextMenu={preventDefault}
        onClick={() => {

          reflash();
        }}
      >
        <span title={`刷新-${title}`}>
          <Icon type="reload" />
          刷新当前页面
        </span>
      </Menu.Item>
      <Menu.Item
        // onContextMenu={preventDefault}
        onClick={() => {

          window.location.reload(true);
        }}
      >
        <span title="强制刷新浏览器">
          <Icon type="reload" />
          刷新浏览器
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        disabled={pages.length <= 1}
        // onContextMenu={preventDefault}
        onClick={() => {

          closeOhterTabs(key);
        }}
      >
        <Icon type="close-circle" />
        关闭其他标签页
      </Menu.Item>
      <Menu.Item
        disabled={pages.length <= 1 || rightDisabled}
        // onContextMenu={preventDefault}
        onClick={() => {

          closeOhterTabs(key, 'right');
        }}
      >
        <Icon type="close-circle" />
        关闭右侧标签页
      </Menu.Item>
      <Menu.Item
        disabled={pages.length <= 1 || leftDisabled}
        // onContextMenu={preventDefault}
        onClick={() => {

          closeOhterTabs(key, 'left');
        }}
      >
        <Icon type="close-circle" />
        关闭左侧标签页
      </Menu.Item>
    </Menu>
  );
};
@connect(({ global, tabs }) => ({
  global, tabs,
}))
class App extends Component {
  state = { pages: [], keys: {} };

  componentDidMount() {
    this.getData();
    this.tipsTitle = getTitle(() => {
      this.tipsTitle = undefined;
    });
    this.closeOhterTabs = this.closeOhterTabs.bind(this);
  }

  componentDidUpdate(preProps) {
    const { tabs } = this.props;
    const { pathname } = tabs;
    if (pathname !== preProps.tabs.pathname) {
      // 当路由发生改变时，显示相应tab页面
      this.getData();
    }
  }

  reflash(key) {
    const { keys } = this.state;
    keys[key] = Date.now();
    this.setState({ keys }, () => {
      message.success('页面已经刷新');
    });
  }

  getData = () => {
    const { tabs, children } = this.props;
    const { pathname, pageName } = tabs;
    const { pages } = this.state;
    const myPage = Object.assign([], pages);
    // 如果是新开标签页，push到tabs标签页数组中，并设置当前激活页面
    if (pathname !== '/' && !pages.some(page => page.key === pathname)) {
      myPage.push({ key: pathname, title: pageName, content: children });
    }
    const keys = {};
    myPage.forEach(item => {
      const { key } = item;
      keys[key] = key;
    });
    this.setState({
      pages: myPage,
      activeKey: pathname,
      keys,
    });
  };

  onEdit = targetKey => {
    /**
     * 参照chrome标签页操作，如果关闭当前页的话：
     * 1. 关闭中间某一标签页，选中该页后一页；
     * 2. 关闭最后一页标签页，选中该页前一页；
     * 3. 仅剩一页时不能删除
     */
    const { pages = [] } = this.state;
    let { activeKey } = this.state;
    let index = null;
    index = pages.findIndex(page => page.key === targetKey);
    if (activeKey === targetKey) {
      const len = pages.length;
      if (index === len - 1) {
        activeKey = pages[len - 2].key;
      } else {
        activeKey = pages[index + 1].key;
      }
    }
    pages.splice(index, 1);
    this.setState({ pages }, () => {
      router.push(activeKey);
    });
  };

  closeOhterTabs(key, direction) {
    const { pages } = this.state;
    if (pages.length <= 1) {
      return;
    }
    let cIndex = 0;
    const newPages = pages
      .map((item, index) => {
        if (item.key === key) {
          cIndex = index;
        }
        return item;
      })
      .map((item, index) => {
        if (direction === 'left') {
          if (index < cIndex) {
            return undefined;
          }
        } else if (direction === 'right') {
          if (index > cIndex) {
            return undefined;
          }
        } else if (item.key !== key) {
          return undefined;
        }
        return item;
      })
      .filter(item => item);
    this.setState({ pages: newPages });
  }

  render() {
    const { pages = [], activeKey, keys } = this.state;

    return (
      <div>
        <DraggableTabs
          className={`page-tab ${pageTabStyle.page}`}
          hideAdd
          activeKey={activeKey}
          type="editable-card"
          onEdit={this.onEdit}
          onTabClick={ev => {
            router.push(ev);
          }}
        >
          {pages.map(pane => {
            return (
              <TabPane
                className={`${pageTabStyle.tabPage}`}
                tab={
                  <Dropdown
                    trigger={['contextMenu']}
                    overlay={menu({
                      pane,
                      pages,
                      closeOhterTabs: this.closeOhterTabs,
                      reflash: () => {
                        this.reflash(pane.key);
                      },
                    })}
                  >
                    <Tooltip overlayStyle={{ maxWidth: 380, top: 20 }} title={this.tipsTitle}>
                      <span
                        style={{ display: 'inline-block' }}
                        onDoubleClick={() => {

                          this.reflash(pane.key);
                        }}
                      >
                        {pane.title}
                      </span>
                    </Tooltip>
                  </Dropdown>
                }
                key={pane.key}
                closable={pages.length > 1}
                style={{ background: 'transparent', paddingLeft: 0, paddingRight: 0 }}
              >
                <div key={keys[pane.key]}>{pane.content}</div>
              </TabPane>
            );
          })}
        </DraggableTabs>
      </div>
    );
  }
}

export default App;
