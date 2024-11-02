import { FC, useCallback, useState } from 'react';

import { Flex, List } from 'antd';

import { GetContactsResponse } from 'common';
import SearchForm from 'components/search-form';
import { useActions } from 'hooks/useActions';
import 'styles/components/contact-list.css';
import { getNumber } from 'utils';

interface ContactsListProps {
  contacts: GetContactsResponse;
}

const ContactsList: FC<ContactsListProps> = ({ contacts }) => {
  const [searchResult, setSearchResult] = useState(contacts);

  const { setActivePhoneNumber } = useActions();

  const handleSearch = useCallback((filteredList: GetContactsResponse) => {
    setSearchResult(filteredList);
  }, []);

  return (
    <Flex vertical style={{ width: 600, alignSelf: 'center' }}>
      <List
        className="contact-list"
        dataSource={searchResult.filter(
          (contact) => contact.type !== 'group' && !contact.id.includes('0@cu.us')
        )}
        bordered
        size="large"
        pagination={{
          pageSize: 6,
        }}
        header={<SearchForm list={contacts} onSearch={handleSearch} />}
        renderItem={(item) => {
          return (
            <List.Item
              className="contact-list__item"
              onClick={() => setActivePhoneNumber(getNumber(item.id))}
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
