import { FC, useState } from 'react';

import { Avatar, Layout, Popover } from 'antd';

import Logo from './logo';
import ProfileInfo from 'components/profile-info';
import { useAppSelector } from 'hooks/redux';
import { useGetWaSettingsQuery } from 'services/endpoints';
import { selectAuth, selectCredentials } from 'store/slices/user-slice';
import 'styles/components/header.css';

const Header: FC = () => {
  const credentials = useAppSelector(selectCredentials);
  const isAuth = useAppSelector(selectAuth);

  const [open, setOpen] = useState(false);

  const { data } = useGetWaSettingsQuery(credentials, { skip: !isAuth || !credentials.idInstance });

  return (
    <Layout.Header className="header">
      <Logo />

      {isAuth && (
        <Popover
          open={open}
          onOpenChange={setOpen}
          trigger="click"
          placement="bottomRight"
          arrow={false}
          content={<ProfileInfo onDone={() => setOpen(false)} />}
        >
          <button className="header__profile" aria-label="Profile" type="button">
            <Avatar src={data?.avatar} size={36}>
              {data?.phone?.slice(-2)}
            </Avatar>
          </button>
        </Popover>
      )}
    </Layout.Header>
  );
};

export default Header;
