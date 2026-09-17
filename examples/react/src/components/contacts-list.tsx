import { FC, useCallback, useState } from 'react';

import { Phone } from '@mui/icons-material';
import { Button, List } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Contact, GetContactsResponse, LID, formatAddress, pickAddress } from 'common';
import PeerAvatar from 'components/peer-avatar';
import SearchForm from 'components/search-form';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { useGetContactsQuery } from 'services/endpoints';
import { selectAddressing } from 'store/slices/call-slice';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/components/contact-list.css';
import { getClient, getConnection } from 'voip';

/**
 * One array to stand in for "no contacts yet", shared by every render.
 *
 * `contacts || []` would build a new array each time, and that array is a dependency of the
 * search effect, which writes its result back into this component's state — a render loop
 * for as long as the query has no data.
 */
const NO_CONTACTS: GetContactsResponse = [];

/** The saved name, or the pushname. Undefined for a contact that carries neither. */
const nameOf = (contact: { contactName?: string; name?: string }): string | undefined =>
  contact.contactName?.trim() || contact.name?.trim() || undefined;

/** What to head the row with: the name if there is one, otherwise the number itself. */
const displayNameOf = (contact: { contactName?: string; name?: string; id: string }): string =>
  nameOf(contact) ?? formatAddress(contact.id);

/** Up to two letters for the avatar disc; a digit-only name keeps its first digits. */
const initialsOf = (contact: { contactName?: string; name?: string; id: string }): string =>
  displayNameOf(contact)
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

const ContactsList: FC = () => {
  const credentials = useAppSelector(selectCredentials);

  const { data: contacts, isLoading } = useGetContactsQuery(credentials);

  const [searchResult, setSearchResult] = useState(contacts);

  const { setActivePeer, setHasActiveCall } = useActions();
  // Which of a contact's addresses a row hands over — the dialler owns that choice.
  const addressing = useAppSelector(selectAddressing);
  const navigate = useNavigate();

  const [pageSize] = useState(8);

  /** Dial straight from the row: the shortcut for when the number needs no checking. */
  const callNow = async (contact: Contact) => {
    try {
      await getClient().dial(pickAddress(contact, addressing));
      await getConnection()?.startAudioBridge();

      setHasActiveCall(true);
      navigate(`/call/${credentials.idInstance}`);
    } catch {
      // The dialler shows the failure; a second toast from the list would only repeat it.
      // Leaving the peer in the field is what makes a retry one click rather than a search.
      setActivePeer({ id: contact.id, lid: contact.lid });
    }
  };

  const handleSearch = useCallback((filteredList: GetContactsResponse) => {
    setSearchResult(filteredList);
  }, []);

  return (
    <>
      <List
        className="contact-list card"
        // The list's own spinner rather than one in place of the list: the column keeps its
        // box and its search field while the contacts load, and the spinner sits in the
        // middle of it instead of collapsing the card to a strip at the top of the page.
        loading={{ spinning: isLoading, size: 'large' }}
        // Groups cannot be called one-to-one, and `0@c.us` is WhatsApp itself — neither is
        // a peer to dial. (The check this replaces looked for `0@cu.us` and so matched
        // nothing, which is why the system contact used to sit at the top of the list.)
        dataSource={searchResult?.filter(
          (contact) => contact.type !== 'group' && contact.id !== '0@c.us'
        )}
        size="large"
        // Nothing to page through until the contacts are here, and a pager that reads
        // "1 / 0" under the spinner looks like a failure rather than a wait.
        pagination={
          isLoading
            ? false
            : {
                pageSize: pageSize,
                size: 'small',
                // A column this narrow cannot hold a page strip and a size picker side by
                // side — they spilled past the card. `simple` keeps it to prev / 1 of N /
                // next.
                simple: true,
                align: 'center',
                showSizeChanger: false,
              }
        }
        header={<SearchForm list={contacts ?? NO_CONTACTS} onSearch={handleSearch} />}
        renderItem={(item) => {
          return (
            <List.Item
              className="contact-list__item"
              onClick={() => setActivePeer({ id: item.id, lid: item.lid })}
              actions={[
                <Button
                  key="call"
                  type="primary"
                  shape="circle"
                  className="contact-list__call"
                  aria-label={`Call ${displayNameOf(item)}`}
                  icon={<Phone sx={{ fontSize: 16 }} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    void callNow(item);
                  }}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<PeerAvatar chatId={item.id} fallback={initialsOf(item)} />}
                title={<span className="contact-list__name">{displayNameOf(item)}</span>}
                description={
                  // Both of a contact's addresses, not the raw chatId: a peer can be
                  // reached by number or by LID, and which one a click hands over depends
                  // on the dialler's current mode — so the one it would use is the one
                  // marked here.
                  <span className="contact-list__addresses">
                    {/* A nameless contact is already headed by its number — repeating it
                        underneath would say nothing twice. */}
                    {nameOf(item) && (
                      <span
                        className={`contact-list__id ${
                          addressing !== LID || !item.lid ? 'contact-list__id--active' : ''
                        }`}
                      >
                        {formatAddress(item.id)}
                      </span>
                    )}
                    {item.lid && (
                      <span
                        className={`contact-list__id contact-list__id--lid ${
                          addressing === LID ? 'contact-list__id--active' : ''
                        }`}
                      >
                        {formatAddress(item.lid)}
                      </span>
                    )}
                  </span>
                }
              />
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default ContactsList;
