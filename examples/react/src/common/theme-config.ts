import { ThemeConfig } from 'antd';

export const THEME: ThemeConfig = {
  token: {
    colorBgBase: 'var(--main-background)',
    colorBgContainer: 'var(--main-background)',
    colorLink: 'var(--link-color)',
    colorLinkHover: 'var(--link-hover-color)',
    colorBgElevated: 'var(--main-background)',
    colorBorder: 'var(--border-color)',
    colorBorderSecondary: 'var(--border-color)',
    colorPrimary: '#009805',
    colorPrimaryBg: '#e9ffdb',
  },
  components: {
    Progress: {
      colorInfo: '#009805',
    },
    Layout: {
      headerBg: 'var(--main-background)',
      colorBgLayout: 'var(--main-background)',
    },
    Tabs: {
      margin: 0,
      colorBorderSecondary: 'var(--second-background)',
    },
    Table: {
      colorBgBase: '#fff',
      colorBgLayout: '#fff',
      colorBgContainer: '#fff',
    },
    Button: {
      colorPrimaryHover: '#009805',
      colorPrimaryActive: '#009805',
    },
    Switch: {
      colorPrimary: '#009805',
      colorPrimaryHover: '#009805',
    },
    Spin: {
      colorPrimary: '#009805',
    },
  },
};
