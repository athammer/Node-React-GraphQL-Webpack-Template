// Imports
import React from 'react';

class Home extends React.Component {

    render() {
        return (<div className="home-render">
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <main role="main" className="inner cover">
                    <h1 className="cover-heading">Welcome to Buy Pixels</h1>
                    <p className="lead">Your one stop shop for buying and selling online items and pixels in a fast, easy, and secure market place!</p>
                    <p className="lead">
                        <a href="/market" className="btn btn-lg btn-secondary">Go to Market Place</a>
                    </p>
                    <hr/>
                    <h1 className="cover-heading">Want to start Buying and Selling?</h1>
                    <p className="lead">Start buying and selling online items and pixels now with a by logging in or with a quick and easy registration!</p>
                    <p className="lead">
                        <a href="/authentication" className="btn btn-lg btn-secondary">Get Access Now!</a>
                    </p>
                </main>
                <br/>
        </div>)
    }

}
export default Home;
