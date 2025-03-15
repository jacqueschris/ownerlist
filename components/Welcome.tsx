import type { NextPage } from 'next';
import { useDataContext } from '../contexts/Data';
import { LoaderCircle } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import axios from 'axios';
import { useDisplayContext } from '../contexts/Display';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';

const Welcome: NextPage = () => {
  useEffect(() => {
    let webApp = window.Telegram.WebApp as any;
    if (!webApp.LocationManager.isInited) {
      webApp.LocationManager.init(getLocation);
    }
  }, []);

  const { register, data, tgData, isLoading } = useDataContext();
  const { setDisplay } = useDisplayContext();

  const { location, error, getLocation } = useLocation();

  const handleEnter = async () => {
    const userNotReady = !data || !data['details'] || !data['preferences'];
    if (userNotReady) {
      register(tgData, data && data.username);
    } else {
      if (location) {
        try {
          await axios.post('/api/user/location', {
            location: location,
            userId: data.id,
            username: tgData.user.username,
          });
        } catch (error) {}
      }
      //await getPotentials();
      setDisplay(<div />);
    }
  };
  return (
    <Card className="w-full max-w-md overflow-hidden shadow-2xl bg-white p-5">
      <CardHeader className="text-center relative block">
        <h1 className="text-4xl font-extrabold text-[#564256] mt-8 mb-2">App Name</h1>
      </CardHeader>
      <CardContent className="text-center px-8">
        <div>
          {data && data.username && (
            <div className="mb-6 bg-[#564256] border-[#564256] p-[8px] rounded-lg">
              <p className="text-[#E8E8E8] text-bold">Welcome {data.name}!</p>
            </div>
          )}
          {isLoading ? (
            <LoaderCircle color="warning" />
          ) : (
            <Button
              size="lg"
              className="w-full max-w-xs bg-[#FC814A] hover:bg-[#564256] text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-200 hover:scale-105"
              onClick={handleEnter}>
              {data && data.username ? 'Continue Your Love Story' : 'Start Your Love Story'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Welcome;
