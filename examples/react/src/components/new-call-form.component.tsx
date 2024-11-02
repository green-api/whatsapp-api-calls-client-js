import { FC, useEffect } from 'react';

import { Phone } from '@mui/icons-material';
import { Button, Form, Input, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { selectActivePhoneNumber } from 'store/slices/call-slice';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/components/new-call-form.css';
import { voipClient } from 'voip';

const NewCallForm: FC = () => {
  const { idInstance } = useAppSelector(selectCredentials);
  const activePhoneNumber = useAppSelector(selectActivePhoneNumber);

  const navigate = useNavigate();

  const [form] = useForm<{ chatId: string }>();

  const { setHasActiveCall } = useActions();

  const onCall = async (values: { chatId: string }) => {
    console.log(values.chatId);

    try {
      await voipClient.startCall(parseInt(values.chatId));
      navigate(`/call/${idInstance}`);
      setHasActiveCall(true);
    } catch (err) {
      notification.error({
        message: 'Произошла ошибка!',
        description: (err as Error).message,
        duration: 10,
      });
    }
  };

  useEffect(() => {
    form.setFieldValue('chatId', activePhoneNumber);
  }, [activePhoneNumber]);

  return (
    <Form name="new-call-form" className="new-call-form" onFinish={onCall} form={form}>
      <Form.Item
        name="chatId"
        initialValue={activePhoneNumber}
        normalize={(value: string) => {
          return value.replaceAll(/[^\d-]/g, '');
        }}
        rules={[
          { required: true, message: 'Поле не может быть пустым' },
          { min: 9, message: 'Некорректное значение' },
        ]}
        validateDebounce={800}
        required
        style={{ width: '90%' }}
      >
        <Input autoComplete="off" type="tel" placeholder={'Номер телефона (без знаков)'} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          shape="circle"
          icon={<Phone sx={{ fontSize: 18 }} />}
        />
      </Form.Item>
    </Form>
  );
};

export default NewCallForm;
