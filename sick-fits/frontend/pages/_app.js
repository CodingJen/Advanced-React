import { ApolloProvider } from '@apollo/client';
import Router from 'next/router';
import Nprogress from 'nprogress';
import Page from '../components/Page';

// TODO: Swap with our own
// import 'nprogress/nprogress.css';
import '../components/styles/nprogress.css';
import { CartStateProvider } from '../lib/cartState';
import withData from '../lib/withData';

Router.events.on('routeChangeStart', () => Nprogress.start());
Router.events.on('routeChangeComplete', () => Nprogress.done());
Router.events.on('routeChangeError', () => Nprogress.done());

function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <CartStateProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </CartStateProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};
export default withData(MyApp);
