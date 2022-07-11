import { BrowserRouter as Router } from 'react-router-dom';
import { HexHiveTheme } from '@hexhive/styles'
import {App} from './App';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ThemeProvider } from '@mui/material';

const API_URL = localStorage.getItem('HEXHIVE_API');


const client = new ApolloClient({
  uri: process.env.NODE_ENV == 'production'
  ? `${API_URL || process.env.REACT_APP_API}/graphql`
  : "http://localhost:7000/graphql",
  cache: new InMemoryCache(),
  credentials: 'include'
})

export default function Root(props) {
  return <Router basename={process.env.PUBLIC_URL}>
    <ApolloProvider client={client}>
      <ThemeProvider theme={HexHiveTheme}>
        <App />
      </ThemeProvider>
    </ApolloProvider>
    </Router>;
}
