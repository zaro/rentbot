import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AdCard from '../ad-card';



const App = (props) =>{
  console.log(props);
  return (
    <MuiThemeProvider userAgent={props.userAgent}>
        <AdCard {...props}/>
    </MuiThemeProvider>
  );
}

export default App;
