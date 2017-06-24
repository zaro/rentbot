import React from 'react';
import AdCard from '../ad-card';



const App = (props) =>{
  console.log(props);
  return (
        <AdCard {...props}/>
  );
}

export default App;
