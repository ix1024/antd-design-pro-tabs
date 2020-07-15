/**
 * @name 寄送管理详情-内嵌页面
 * @Author hz19114716
 * @Date 2019-12-04
 */
import { stringify } from 'qs';
import { store } from '@/utils/utils';
import withRouter from 'umi/withRouter';
import React, { Component } from 'react';
import PageLoading from '@/components/PageLoading';
import style from './index.less';

const { get } = store;

class CustomPageApp extends Component {
  state = { id: undefined };

  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    const { title, url, data } = get(id, 'sessionstorage') || {};
    this.setState({ id, title, url, data });
  }

  render() {
    const { url, title, data } = this.state;
    if (!url) {
      return <PageLoading />;
    }
    const src = `${url}${url.indexOf('?') !== -1 ? '&' : '?'}${stringify(data)}`;
    return <iframe className={style.iframe} title={title} src={src} frameBorder="0" />;
  }
}

export default withRouter(CustomPageApp);
