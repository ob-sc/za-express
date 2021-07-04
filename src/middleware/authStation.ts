import { RequestHandler } from 'express';
import { StationID } from '../../za-types/server/results';
import sqlStrings from '../sql';

const authStation: RequestHandler = (req, res, next) => {
  const { user } = req.session;
  const extstat = user?.extstat ?? [];

  const allowedStations = [user?.station, ...extstat];
  res.authStation = (station) => {
    const { query, close } = res.database();
    // wenn index 0 von extstat wildcard ist dann true
    if (allowedStations[1] === '*') return true;

    if (user?.region !== null) {
      const userRegion = user?.region?.toLowerCase();
      query<StationID>(sqlStrings.stationen.selRegion, [userRegion, userRegion])
        .then((data) => {
          close();
          for (const item of data.results) {
            allowedStations.push(item.id);
          }
        })
        .catch(() => {
          close();
        });
    }

    const authStations = allowedStations.filter((astat) => astat === station);
    return authStations.length > 0;
  };
  next();
};

export default authStation;
