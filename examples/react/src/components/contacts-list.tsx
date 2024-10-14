import { FC, useCallback, useState } from 'react';

import { Phone } from '@mui/icons-material';
import { Button, Flex, List } from 'antd';
import { useNavigate } from 'react-router-dom';

import { GetContactsResponse } from 'common';
import SearchForm from 'components/search-form';
import { useAppSelector } from 'hooks/redux';
import { selectCredentials } from 'store/slices/user-slice';
import { getNumber } from 'utils';
import { voipClient } from 'voip';

interface ContactsListProps {
  contacts: GetContactsResponse;
}

const ContactsList: FC<ContactsListProps> = ({ contacts }) => {
  const navigate = useNavigate();
  const { idInstance } = useAppSelector(selectCredentials);
  const [searchResult, setSearchResult] = useState(contacts);

  const handleSearch = useCallback((filteredList: GetContactsResponse) => {
    setSearchResult(filteredList);
  }, []);

  const onCallToContact = async (phoneNumber: string) => {
    console.log(phoneNumber);
    navigate(`/call/${idInstance}`);
    await voipClient.startCall(parseInt(phoneNumber));
  };

  return (
    <Flex vertical style={{ width: 600, alignSelf: 'center' }}>
      <SearchForm list={contacts} onSearch={handleSearch} />
      <List
        dataSource={searchResult.filter(
          (contact) => contact.type !== 'group' && !contact.id.includes('0@cu.us')
        )}
        bordered
        size="large"
        pagination={{
          pageSize: 8,
        }}
        renderItem={(item) => {
          return (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  shape="circle"
                  key={item.id}
                  onClick={() => onCallToContact(getNumber(item.id))}
                  icon={<Phone sx={{ fontSize: 18 }} />}
                />,
              ]}
            >
              <List.Item.Meta
                title={item.contactName || item.name || getNumber(item.id)}
                description={item.id}
              />
            </List.Item>
          );
        }}
      />
    </Flex>
  );
};

export default ContactsList;
