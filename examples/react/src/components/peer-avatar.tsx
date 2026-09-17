import { FC } from 'react';

import { Person } from '@mui/icons-material';

import { useAppSelector } from 'hooks/redux';
import { useGetAvatarQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/components/peer-avatar.css';

interface PeerAvatarProps {
  /** Whose photo to ask for, as `<number>@c.us` or `<id>@lid`. */
  chatId?: string;
  /** What to show while there is no photo: initials, or the person icon when empty. */
  fallback?: string;
  size?: 'sm' | 'lg';
  className?: string;
}

/**
 * The peer's photo, with a graceful way down.
 *
 * Most peers have no photo we may see — it is missing, or privacy hides it — so the
 * fallback is the normal case rather than an error path: initials when we know a name,
 * the person icon when we only know a number. The photo is requested per chat, and the
 * query cache means the same peer costs one request no matter how many places show it.
 */
const PeerAvatar: FC<PeerAvatarProps> = ({ chatId, fallback, size = 'sm', className = '' }) => {
  const credentials = useAppSelector(selectCredentials);

  const { data } = useGetAvatarQuery(
    { ...credentials, chatId: chatId ?? '' },
    { skip: !chatId || !credentials.idInstance }
  );

  const url = data?.available ? data.urlAvatar : '';
  const classes = `peer-avatar peer-avatar--${size} ${className}`.trim();

  if (url) {
    return <img className={classes} src={url} alt="" loading="lazy" />;
  }

  return <span className={classes}>{fallback || <Person className="peer-avatar__icon" />}</span>;
};

export default PeerAvatar;
