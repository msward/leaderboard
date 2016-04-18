import React from 'react';

class Home extends React.Component {
  render() {
    return (
      <div className='alert alert-info'>
        Hello from the Shawnee Tribe Home Component
        <div className='col-sm-7 hidden-xs'>
          <h3 className='lead'><strong>Leaderboard</strong>Events</h3>
          <ul className='list-inline'>
              This is where the events would go!
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
