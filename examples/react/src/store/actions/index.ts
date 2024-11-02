import { callActions } from 'store/slices/call-slice';
import { userActions } from 'store/slices/user-slice';

export const actionCreators = {
  ...userActions,
  ...callActions,
};
