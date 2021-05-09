import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0";
import {
  Alert,
  ChakraProvider,
  Spinner,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useApollo } from "src/lib/apollo";
import { SWRConfig } from "swr";
import CompleteUserInformation from "../components/CompleteUserInformation";
import Header from "../components/Header";
import theme from "../lib/theme";
import useUser from "../lib/useUser";
import NextNprogress from "nextjs-progressbar";
import Head from "next/head";

function App({ Component, pageProps }) {
  const client = useApollo(pageProps.apolloState);
  return (
    <>
      <Head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#144733' />
        <meta name='apple-mobile-web-app-title' content='Track &amp; Trace' />
        <meta name='application-name' content='Track &amp; Trace' />
        <meta name='msapplication-TileColor' content='#144733' />
        <meta name='theme-color' content='#144733' />
      </Head>
      <NextNprogress
        color={theme.colors.white}
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        options={{
          showSpinner: false,
        }}
      />
      <ApolloProvider client={client}>
        <UserProvider>
          <ChakraProvider theme={theme}>
            <Box minHeight='100vh' height='100%'>
              <Header />
              <ProtectedApp Component={Component} pageProps={pageProps} />
            </Box>
          </ChakraProvider>
        </UserProvider>
      </ApolloProvider>
    </>
  );
}

function ProtectedApp({ Component, pageProps }) {
  const router = useRouter();
  const { isLoading, error, user } = useUser();

  useEffect(() => {
    if (!isLoading && !error && !user) {
      router.replace("/api/auth/login");
    }
  }, [isLoading, error, user, router]);

  if (isLoading)
    return (
      <Spinner
        size='xl'
        position='fixed'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
      />
    );
  if (error)
    return (
      <Alert
        status='error'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='200px'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          {error.name}
        </AlertTitle>
        <AlertDescription maxWidth='sm'>{error.message}</AlertDescription>
      </Alert>
    );
  if (user)
    return (
      <>
        <Component {...pageProps} />
        <CompleteUserInformation />
      </>
    );
  return <></>;
}

export default App;
