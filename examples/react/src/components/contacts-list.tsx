import { FC, useCallback, useState } from 'react';

import { Flex, List, Spin } from 'antd';

import { GetContactsResponse } from 'common';
import SearchForm from 'components/search-form';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { useGetContactsQuery } from 'services/endpoints';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/components/contact-list.css';
import { getNumber } from 'utils';

const ContactsList: FC = () => {
  const credentials = useAppSelector(selectCredentials);

  const { data: contacts, isLoading } = useGetContactsQuery(credentials);

  const [searchResult, setSearchResult] = useState(contacts);

  const { setActivePhoneNumber } = useActions();

  const [pageSize, setPageSize] = useState(6);

  const handleSearch = useCallback((filteredList: GetContactsResponse) => {
    setSearchResult(filteredList);
  }, []);

  if (isLoading) {
    return <Spin size="large" style={{ alignSelf: 'center' }} />;
  }

  return (
    <Flex vertical style={{ width: 600, alignSelf: 'center', padding: 10 }}>
      <List
        className="contact-list"
        dataSource={searchResult?.filter(
          (contact) => contact.type !== 'group' && !contact.id.includes('0@cu.us')
        )}
        bordered
        size="large"
        pagination={{
          total: searchResult?.length,
          pageSize: pageSize,
          pageSizeOptions: [6, 10, 20, 50, 100],
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
        header={<SearchForm list={contacts || []} onSearch={handleSearch} />}
        renderItem={(item) => {
          return (
            <List.Item
              className="contact-list__item"
              onClick={() => setActivePhoneNumber(getNumber(item.id))}
            >
              <List.Item.Meta
                title={item.contactName?.trim() || item.name?.trim() || getNumber(item.id)}
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
