import { FC } from 'react';

import { Avatar, Button, Spin } from 'antd';

import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { useGetWaSettingsQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/components/profile-info.css';
import { closeVoip } from 'voip';

interface ProfileInfoProps {
  onDone?: () => void;
}

/** Who this instance is, and the way out. Shown in the panel under the header avatar. */
const ProfileInfo: FC<ProfileInfoProps> = ({ onDone }) => {
  const credentials = useAppSelector(selectCredentials);

  const { data, isLoading } = useGetWaSettingsQuery(credentials);

  const { logout } = useActions();

  const onLogout = () => {
    onDone?.();
    logout();
    closeVoip();
  };

  if (isLoading) {
    return (
      <div className="profile-panel profile-panel--loading">
        <Spin />
      </div>
    );
  }

  return (
    <div className="profile-panel">
      <div className="profile-panel__head">
        <Avatar src={data?.avatar} size={48}>
          {data?.phone?.slice(-2)}
        </Avatar>
        <div className="profile-panel__who">
          <div className="profile-panel__phone">{data?.phone}</div>
          <div className="profile-panel__state">{data?.stateInstance}</div>
        </div>
      </div>

      <div className="profile-panel__row">
        <span className="profile-panel__key">Instance</span>
        <span className="profile-panel__value">{credentials.idInstance}</span>
      </div>
      <div className="profile-panel__row">
        <span className="profile-panel__key">Device</span>
        <span className="profile-panel__value">{data?.deviceId}</span>
      </div>

      <Button block onClick={onLogout} danger>
        Log out
      </Button>
    </div>
  );
};

export default ProfileInfo;
