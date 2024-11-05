import { FC } from 'react';

import { Button, Card, Form, Input, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

import { StateInstanceEnum } from 'common';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { Routes } from 'router/routes';
import { useLazyGetStateInstanceQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/components/auth-form.css';
import { getErrorMessage } from 'utils';

interface FormValues {
  idInstance: string;
  apiTokenInstance: string;
}

const AuthForm: FC = () => {
  const [form] = Form.useForm<FormValues>();
  const { idInstance, apiTokenInstance } = useAppSelector(selectCredentials);
  const { setCredentials } = useActions();
  const navigate = useNavigate();
  const [getStateInstance, { isLoading }] = useLazyGetStateInstanceQuery();

  const onSignIn = async (values: FormValues) => {
    const { apiTokenInstance, idInstance } = values;
    const credentials = { idInstance, apiTokenInstance };

    const { data, error } = await getStateInstance({ apiTokenInstance, idInstance });

    if (data) {
      switch (data.stateInstance) {
        case StateInstanceEnum.Authorized:
          setCredentials(credentials);

          navigate(Routes.MAIN);

          return;

        case StateInstanceEnum.Blocked:
          return notification.warning({
            message: 'Предупреждение',
            description: 'Аккаунт забанен',
            duration: 4,
          });

        case StateInstanceEnum.NotAuthorized:
          return notification.warning({
            message: 'Предупреждение',
            description: 'Аккаунт не авторизован',
            duration: 4,
          });

        case StateInstanceEnum.Starting:
          return notification.warning({
            message: 'Предупреждение',
            description: 'Аккаунт в процессе запуске',
            duration: 4,
          });

        case StateInstanceEnum.YellowCard:
          return notification.warning({
            message: 'Предупреждение',
            description:
              'На аккаунте частично или полностью приостановлена отправка сообщений из-за спамерской активности',
            duration: 4,
          });
      }
    }

    if (error) {
      notification.error({
        message: 'Произошла ошибка!',
        description: getErrorMessage(error),
        duration: 4,
      });
    }
  };

  return (
    <Card className="form-card">
      <Form name="auth-form" size="large" onFinish={onSignIn} form={form}>
        <Form.Item
          name="idInstance"
          hasFeedback
          initialValue={idInstance}
          rules={[
            { required: true, message: 'idInstance не может быть пустым!' },
            { whitespace: true, message: 'idInstance не может быть пустым!' },
          ]}
        >
          <Input placeholder="idInstance" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="apiTokenInstance"
          hasFeedback
          initialValue={apiTokenInstance}
          rules={[
            { required: true, message: 'apiTokenInstance не может быть пустым!' },
            { whitespace: true, message: 'apiTokenInstance не может быть пустым!' },
          ]}
        >
          <Input placeholder="apiTokenInstance" autoComplete="off" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={isLoading}
          >
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AuthForm;
