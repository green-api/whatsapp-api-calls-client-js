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
    if (!searchTerm) {
      onSearch(list);

      return;
    }

    const term = searchTerm.toLowerCase();
    // A row shows its address spaced and plussed, so a search for what is on screen has to
    // survive that: both sides drop to bare digits before they are compared.
    const digits = searchTerm.replace(/\D/g, '');

    onSearch(
      list.filter((item) => {
        if (
          item.contactName?.toLowerCase().includes(term) ||
          item.name?.toLowerCase().includes(term)
        ) {
          return true;
        }

        // Both addresses, because a row shows both: searching for the LID printed on screen
        // has to find the row that prints it.
        const addresses = [item.id, item.lid].filter(Boolean) as string[];

        return digits
          ? addresses.some((address) => address.replace(/\D/g, '').includes(digits))
          : addresses.some((address) => address.toLowerCase().includes(term));
      })
    );
  }, [searchTerm, onSearch, list]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Flex justify="space-between" style={{ marginBottom: '20px' }}>
      <Flex flex="1">
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
          style={{ marginRight: '10px' }}
        />
      </Flex>
    </Flex>
  );
};

export default SearchForm;
