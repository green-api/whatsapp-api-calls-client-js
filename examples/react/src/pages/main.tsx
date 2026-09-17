import { FC } from 'react';

import ContactsList from 'components/contacts-list';
import SocketConnectionInfo from 'components/socket-connection-info';
import Softphone from 'components/softphone';
import 'styles/pages/main.css';

const Main: FC = () => {
  return (
    <div className="page page--wide">
      <div className="main-page__top">
        <SocketConnectionInfo />
      </div>

      <div className="main-page__columns">
        <section className="main-page__dialler">
          <Softphone />
        </section>
        <aside className="main-page__contacts">
          <ContactsList />
        </aside>
      </div>
    </div>
  );
};

export default Main;
