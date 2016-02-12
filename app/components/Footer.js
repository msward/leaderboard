import React from 'react';
import {Link} from 'react-router';
import FooterStore from '../stores/FooterStore'
import FooterActions from '../actions/FooterActions';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = FooterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    FooterStore.listen(this.onChange);
    FooterActions.getTopPrincesses();
  }

  componentWillUnmount() {
    FooterStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let leaderboardPrincesses = this.state.princesses.map((princess) => {
      return (
        <li key={princess.princessId}>
          <Link to={'/princesses/' + princess.princessId}>
            <img className='thumb-md' src={'http://image.eveonline.com/Character/' + princess.princessId + '_128.jpg'} />
          </Link>
        </li>
      )
    });

    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-5'>
              <h3 className='lead'><strong>Information</strong> and <strong>Copyright</strong></h3>
              <p>Powered by <strong>Node.js</strong>, <strong>MongoDB</strong> and <strong>React</strong> with Flux architecture and server-side rendering.</p>
              <p>You may view the <a href='https://github.com/msward/leaderboard'>Source Code</a> behind this project on GitHub.</p>
              <p>© 2016 Michael Ward.</p>
            </div>
            <div className='col-sm-7 hidden-xs'>
              <h3 className='lead'><strong>Leaderboard</strong> Top 5 Princesses</h3>
              <ul className='list-inline'>
                {leaderboardPrincesses}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
