import { FC, useEffect, useState } from 'react';

import { Statistic } from 'antd';

import { formatTimerValue, WorkerInterval } from 'utils';

const CountUpTimer: FC = () => {
  const [millisecondsElapsed, setMillisecondsElapsed] = useState(0);
  const [workerInterval, setWorkerInterval] = useState<WorkerInterval | null>(null);

  useEffect(() => {
    if (!workerInterval) {
      setWorkerInterval(
        new WorkerInterval(() => {
          setMillisecondsElapsed((prevMilliseconds) => prevMilliseconds + 10);
        }, 10)
      );
    }

    return () => {
      workerInterval?.stop();

      setWorkerInterval(null);
    };
  }, []);

  return (
    <Statistic
      value={millisecondsElapsed}
      formatter={(value) => formatTimerValue(value as number)}
    />
  );
};

export default CountUpTimer;
