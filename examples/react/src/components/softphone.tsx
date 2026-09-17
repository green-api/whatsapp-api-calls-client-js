import { FC, useEffect, useMemo, useState } from 'react';

import { Backspace, Phone } from '@mui/icons-material';
import { Button, Select, notification } from 'antd';
import { AsYouType, CountryCode } from 'libphonenumber-js';
import { useNavigate } from 'react-router-dom';

import {
  Addressing,
  COUNTRIES,
  DEFAULT_COUNTRY,
  LID,
  countryByCode,
  parseAddress,
  pickAddress,
  toDialTarget,
} from 'common';
import { useAppSelector } from 'hooks/redux';
import { useActions } from 'hooks/useActions';
import { useGetWaSettingsQuery } from 'services/endpoints';
import { selectActivePeer, selectAddressing } from 'store/slices/call-slice';
import { selectCredentials } from 'store/slices/user-slice';
import 'styles/components/softphone.css';
import { getClient, getConnection } from 'voip';

/** The keypad, in the order a phone has always had it. */
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

/** The letters under the digits: they are what makes a keypad read as a phone. */
const LETTERS: Record<string, string> = {
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ',
};

/**
 * The dialler, for both kinds of address.
 *
 * A phone number is chosen by country and formatted as that country writes it; a LID has
 * no country and no format, so the field shows it as it is. Which of the two is in play is
 * visible in the same place either way — the chip to the left of the number — because
 * dialling the right digits to the wrong kind of address fails in a way that is hard to
 * read from the error.
 */
const Softphone: FC = () => {
  const credentials = useAppSelector(selectCredentials);
  const activePeer = useAppSelector(selectActivePeer);
  // The kind of address lives in the store because the contact list reads it too: it is
  // what decides whether a row hands over its number or its LID.
  const addressing = useAppSelector(selectAddressing);

  const navigate = useNavigate();
  const { setHasActiveCall, setAddressing, setDefaultAddressing, setActivePeer } = useActions();

  const { data: settings } = useGetWaSettingsQuery(credentials, { skip: !credentials.idInstance });

  const [digits, setDigits] = useState('');
  const [dialling, setDialling] = useState(false);

  // The instance's own number is the best guess at who the user calls: start there rather
  // than at some arbitrary default. The store applies it only while nothing has been chosen,
  // so this cannot take the country back from the user on a later mount.
  useEffect(() => {
    if (!settings?.phone) {
      return;
    }

    const own = parseAddress(`${settings.phone}@c.us`);

    if (own.addressing) {
      setDefaultAddressing(own.addressing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.phone]);

  // A contact is picked in the list, and stays picked: this re-resolves it whenever the
  // kind of addressing changes, so switching to LID swaps the number for that peer's LID
  // rather than leaving its digits sitting under the wrong label. A peer with no LID comes
  // back as a number, and the chip follows it back to the country — there is nothing else
  // to dial.
  useEffect(() => {
    if (!activePeer) {
      return;
    }

    const picked = parseAddress(pickAddress(activePeer, addressing));
    // Never stay on LID for something that is not one: that would send a phone number to
    // `@lid` and fail in a way the error does not explain.
    const next = picked.addressing ?? (picked.isLid ? LID : DEFAULT_COUNTRY);

    if (next !== addressing) {
      setAddressing(next);
    }

    setDigits(picked.digits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePeer, addressing]);

  const isLid = addressing === LID;
  const country = isLid ? undefined : countryByCode(addressing as CountryCode);

  /** A phone as its country writes it; a LID as it is. */
  const shown = useMemo(
    () => (isLid ? digits : new AsYouType(addressing as CountryCode).input(digits)),
    [isLid, addressing, digits]
  );

  const limit = isLid ? 20 : 15;

  /** Editing by hand detaches the field from the contact it was filled from. */
  const edit = (next: (current: string) => string) => {
    setActivePeer(null);
    setDigits(next);
  };

  /**
   * Choosing the kind of address is the user's decision, and it has to stick.
   *
   * The picked contact stays only if it actually has an address of the chosen kind — its
   * LID when LID is chosen, a number of that country when a country is chosen. Otherwise it
   * is let go, because the effect above would resolve it straight back to its own kind and
   * undo the choice a render later: that is what made both LID and any other country
   * unreachable while a contact was selected. Digits go too, but only when the kind itself
   * flips, since a LID means nothing under a country and a number means nothing under LID.
   */
  const changeAddressing = (next: Addressing) => {
    const nextIsLid = next === LID;
    const peerFits =
      activePeer !== null && parseAddress(pickAddress(activePeer, next)).addressing === next;

    if (!peerFits) {
      setActivePeer(null);

      if (nextIsLid !== isLid) {
        setDigits('');
      }
    }

    setAddressing(next);
  };

  // Digits only, whichever kind is being dialled. `*` and `#` used to be accepted for phone
  // numbers, where they went straight into the dialled address while the formatter dropped
  // them from the field — so the number on screen and the number called were not the same.
  const press = (key: string) => edit((current) => (current + key).slice(0, limit));
  const erase = () => edit((current) => current.slice(0, -1));

  const onCall = async () => {
    if (!digits || dialling) {
      return;
    }

    setDialling(true);

    try {
      // Signalling first, bridge second: an offer without a call on the server is refused.
      await getClient().dial(toDialTarget(addressing, digits));
      await getConnection()?.startAudioBridge();

      setHasActiveCall(true);
      navigate(`/call/${credentials.idInstance}`);
    } catch (err) {
      notification.error({
        message: 'Something went wrong',
        description: (err as Error).message,
        duration: 10,
      });
    } finally {
      setDialling(false);
    }
  };

  return (
    <div className="card softphone">
      <div className="softphone__display">
        <Select<Addressing>
          className={`softphone__country ${isLid ? 'softphone__country--lid' : ''}`}
          value={addressing}
          onChange={changeAddressing}
          showSearch
          optionFilterProp="label"
          popupMatchSelectWidth={300}
          aria-label="Address kind"
          labelRender={() => (
            <span className="softphone__country-value">
              {isLid ? (
                'LID'
              ) : (
                <>
                  <span className="softphone__flag">{country?.flag}</span>+{country?.callingCode}
                </>
              )}
            </span>
          )}
          options={[
            { value: LID, label: 'LID — a peer without a number' },
            ...COUNTRIES.map((item) => ({
              value: item.code as Addressing,
              label: `${item.flag} ${item.name} +${item.callingCode}`,
            })),
          ]}
        />

        <input
          className="softphone__number"
          value={shown}
          onChange={(event) => edit(() => event.target.value.replace(/\D/g, '').slice(0, limit))}
          placeholder={isLid ? 'LID digits' : 'Phone number'}
          inputMode="numeric"
          aria-label={isLid ? 'LID to dial' : 'Number to dial'}
        />

        <button
          className="softphone__erase"
          onClick={erase}
          disabled={!digits}
          aria-label="Erase"
          type="button"
        >
          <Backspace sx={{ fontSize: 20 }} />
        </button>
      </div>

      <div className="softphone__keys">
        {KEYS.map((key) => (
          <button
            className="softphone__key"
            key={key}
            onClick={() => press(key)}
            // Kept in the grid because a keypad without them does not read as one, but they
            // dial nothing here: a WhatsApp address is digits.
            disabled={!/\d/.test(key)}
            type="button"
          >
            <span className="softphone__digit">{key}</span>
            <span className="softphone__letters">{isLid ? ' ' : (LETTERS[key] ?? ' ')}</span>
          </button>
        ))}
      </div>

      <Button
        className="softphone__call"
        type="primary"
        shape="circle"
        onClick={onCall}
        loading={dialling}
        disabled={!digits}
        aria-label="Call"
        icon={<Phone sx={{ fontSize: 26 }} />}
      />
    </div>
  );
};

export default Softphone;
