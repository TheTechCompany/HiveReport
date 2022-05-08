import { BrowserRouter as Router } from 'react-router-dom';
import { Grommet } from 'grommet'
import { BaseStyle } from '@hexhive/styles'
import {App} from './App';

export default function Root(props) {
  return <Router basename={process.env.PUBLIC_URL}>
    <Grommet 
      full
      style={{flex: 1, display: 'flex'}}
      theme={BaseStyle}>
      <App />
    </Grommet>
    </Router>;
}
