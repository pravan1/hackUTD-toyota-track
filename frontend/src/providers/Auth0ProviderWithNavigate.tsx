import { ReactNode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface Auth0ProviderWithNavigateProps {
  children: ReactNode;
}

const getEnv = (key: string) =>
  import.meta.env[key as keyof ImportMetaEnv] ??
  (window as unknown as Record<string, string | undefined>)[key];

export function Auth0ProviderWithNavigate({
  children
}: Auth0ProviderWithNavigateProps) {
  const navigate = useNavigate();

  const domain =
    (getEnv('VITE_AUTH0_DOMAIN') as string | undefined) ||
    (getEnv('REACT_APP_AUTH0_DOMAIN') as string | undefined);
  const clientId =
    (getEnv('VITE_AUTH0_CLIENT_ID') as string | undefined) ||
    (getEnv('REACT_APP_AUTH0_CLIENT_ID') as string | undefined);
  const audience =
    (getEnv('VITE_AUTH0_AUDIENCE') as string | undefined) ||
    (getEnv('REACT_APP_AUTH0_AUDIENCE') as string | undefined);

  if (!domain || !clientId) {
    console.warn(
      'Auth0 environment variables are missing. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID.'
    );
  }

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || '/app');
  };

  return (
    <Auth0Provider
      domain={domain ?? ''}
      clientId={clientId ?? ''}
      authorizationParams={{
        redirect_uri: window.location.origin + '/app',
        audience: audience ?? undefined
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}

