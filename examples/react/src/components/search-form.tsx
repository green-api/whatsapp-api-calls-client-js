import { ChangeEvent, useEffect, useState } from 'react';

import { Input, Flex } from 'antd';

import { GetContactsResponse } from 'common';

const SearchForm = ({
  list,
  onSearch,
}: {
  list: GetContactsResponse;
  onSearch: (list: GetContactsResponse) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm) {
      const filteredList = list.filter(
        (item) =>
          item.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onSearch(filteredList);
    } else {
      onSearch(list);
    }
  }, [searchTerm, onSearch, list]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Flex justify="space-between" style={{ marginBottom: '20px' }}>
      <Flex flex="1">
        <Input
          placeholder="Введите текст для поиска"
          value={searchTerm}
          onChange={handleChange}
          style={{ marginRight: '10px' }}
        />
      </Flex>
    </Flex>
  );
};

export default SearchForm;
