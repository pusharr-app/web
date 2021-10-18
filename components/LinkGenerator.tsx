import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { KeyInfo } from '../utils/apikeys';

export const LinkGenerator: React.FC<{ apikeys: KeyInfo[] }> = ({
  apikeys,
}) => {
  const [apikey, setApikey] = useState<string>(() => apikeys[0]?.key ?? 'none');
  const [service, setService] = useState('sonarr');

  const url = `https://www.pusharr.com/api/hook/${service}?apikey=${apikey}`;

  function copyUrl() {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  }

  return (
    <div className="rounded-md bg-gray-700 p-4">
      <h3 className="text-base text-white">Webhook links</h3>
      <div className="flex space-x-2 justify-between">
        <div className="flex-grow">
          <label
            htmlFor="apikey"
            className="hidden text-sm font-medium text-white"
          >
            apikey
          </label>
          <select
            id="apikey"
            name="apikey"
            onChange={(event) => setApikey(event.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={apikey}
          >
            <option disabled value="none">
              Select an apikey
            </option>
            {apikeys.map((key) => (
              <option key={key.key} value={key.key}>
                {key.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-grow">
          <label
            htmlFor="service"
            className="hidden text-sm font-medium text-white"
          >
            service
          </label>
          <select
            id="service"
            name="service"
            onChange={(event) => setService(event.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={service}
          >
            <option value="sonarr">Sonarr</option>
            <option value="radarr">Radarr</option>
          </select>
        </div>
      </div>
      {apikey && (
        <p className="text-white text-xs mt-2">
          Paste the following link into your webhook settings:{' '}
          <button type="button" onClick={() => copyUrl()}>
            <code className="whitespace-nowrap">{url}</code>
          </button>{' '}
          (click on it to copy)
        </p>
      )}
    </div>
  );
};
