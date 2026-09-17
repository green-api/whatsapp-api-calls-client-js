import { FC } from 'react';

import { Button, Card, Form, Input, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

import { StateInstanceEnum, UserCredentials } from 'common';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { Routes } from 'router/routes';
import { useLazyGetStateInstanceQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/components/auth-form.css';
import { getErrorMessage } from 'utils';

interface FormValues extends UserCredentials {}

const AuthForm: FC = () => {
  const [form] = Form.useForm<FormValues>();
  const { idInstance, apiTokenInstance, apiUrl } = useAppSelector(selectCredentials);
  const { setCredentials } = useActions();
  const navigate = useNavigate();
  const [getStateInstance, { isLoading }] = useLazyGetStateInstanceQuery();

  const onSignIn = async (values: FormValues) => {
    const { data, error } = await getStateInstance(values);

    if (data) {
      switch (data.stateInstance) {
        case StateInstanceEnum.Authorized:
          setCredentials(values);

          navigate(Routes.MAIN);

          return;

        case StateInstanceEnum.Blocked:
          return notification.warning({
            message: 'Warning',
            description: 'This account is banned',
            duration: 4,
          });

        case StateInstanceEnum.NotAuthorized:
          return notification.warning({
            message: 'Warning',
            description: 'This account is not authorized',
            duration: 4,
          });

        case StateInstanceEnum.Starting:
          return notification.warning({
            message: 'Warning',
            description: 'This account is still starting up',
            duration: 4,
          });

        case StateInstanceEnum.YellowCard:
          return notification.warning({
            message: 'Warning',
            description:
              'Sending messages from this account is partially or fully suspended because of spam activity',
            duration: 4,
          });
      }
    }

    if (error) {
      notification.error({
        message: 'Something went wrong',
        description: getErrorMessage(error),
        duration: 4,
      });
    }
  };

  return (
    <div className="auth-screen">
      <Card className="form-card">
        <div className="form-card__title">Sign in</div>
        <div className="form-card__hint">
          The instance must already be authorized — this demo only places and answers calls.
        </div>
        <Form name="auth-form" size="large" layout="vertical" onFinish={onSignIn} form={form}>
          <Form.Item
            name="apiUrl"
            label="API URL"
            hasFeedback
            initialValue={apiUrl}
            rules={[
              { required: true, message: 'apiUrl is required' },
              { whitespace: true, message: 'apiUrl is required' },
            ]}
          >
            <Input placeholder="https://1103.api.green-api.com" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="idInstance"
            label="Instance ID"
            hasFeedback
            initialValue={idInstance}
            rules={[
              { required: true, message: 'idInstance is required' },
              { whitespace: true, message: 'idInstance is required' },
            ]}
          >
            <Input placeholder="1103000000" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="apiTokenInstance"
            label="API token"
            hasFeedback
            initialValue={apiTokenInstance}
            rules={[
              { required: true, message: 'apiTokenInstance is required' },
              { whitespace: true, message: 'apiTokenInstance is required' },
            ]}
          >
            {/* A token is a credential: shown only when its owner asks to see it. */}
            <Input.Password placeholder="Instance API token" autoComplete="off" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isLoading}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AuthForm;
