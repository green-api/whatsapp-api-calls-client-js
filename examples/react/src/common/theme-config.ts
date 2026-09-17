import { ThemeConfig } from 'antd';

/**
 * The antd side of the design tokens in App.css.
 *
 * Only what antd cannot read from CSS variables lives here: radii, control sizes and the
 * accent. Colours stay in one place — the variables — so the two never drift apart.
 */
export const THEME: ThemeConfig = {
  token: {
    colorPrimary: '#009805',
    colorLink: '#009805',
    colorLinkHover: '#007a04',
    colorText: '#0f1c14',
    colorTextSecondary: '#5c6b61',
    colorTextTertiary: '#8b978f',
    colorBorder: '#e6eae7',
    colorBorderSecondary: '#e6eae7',
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f4f6f5',
    colorError: '#e5484d',
    borderRadius: 12,
    borderRadiusLG: 14,
    borderRadiusSM: 10,
    controlHeight: 44,
    controlHeightLG: 48,
    fontSize: 15,
    lineHeight: 1.5,
    boxShadow: '0 4px 16px rgba(15, 28, 20, 0.07)',
    boxShadowSecondary: '0 12px 40px rgba(15, 28, 20, 0.12)',
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 68,
      headerPadding: '0 24px',
      bodyBg: '#f4f6f5',
    },
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
      fontWeight: 500,
    },
    Input: {
      paddingBlock: 10,
      paddingInline: 14,
    },
    List: {
      itemPadding: '14px 16px',
    },
    Notification: {
      borderRadiusLG: 14,
    },
    Spin: {
      colorPrimary: '#009805',
    },
  },
};
