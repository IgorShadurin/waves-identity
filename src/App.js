import React, {Component, Fragment} from 'react';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            wavesKeeper: window.WavesKeeper,
            isLogged: false,
            address: '',
            email: '',
            oracleAddress: '3N3CRMyAsGZnnsdrxvntQgVc1HuLn689Vpi',
            contractAddress: ''
        };

        this.checkWavesKeeperInterval = setInterval(() => {
            if (window.WavesKeeper) {
                console.log(window.WavesKeeper);
                this.setState({wavesKeeper: window.WavesKeeper});
                clearInterval(this.checkWavesKeeperInterval);

                window.WavesKeeper.publicState()
                    .then(state => {
                        console.log(state);
                        if (state.locked === false && state.account) {
                            this.setState({
                                address: state.account.address,
                                isLogged: true
                            });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        }, 100);
    }

    onChange = (e) => {
        this.setState({
            [e.target.dataset.field]: e.target.value
        });
    };

    onAuth = () => {
        const authData = {data: "Auth on my site"};
        console.log(this.wavesKeeper);
        this.state.wavesKeeper.auth(authData)
            .then(auth => {
                this.setState({isLogged: true, address: auth.address});
                console.log(auth);
            })
            .catch(error => {
                console.error(error);
            });
    };

    onSendEmailVerification = () => {
        // todo send data transaction to myself and send tx to oracle
        if (!this.state.email) {
            alert('Please, enter correct email');
            return;
        }

        const txData = {
            type: 12,
            data: {
                data: [
                    {
                        "key": "check_email",
                        "type": "string",
                        "value": this.state.email
                    }
                ],
                fee: {
                    tokens: "0.001",
                    assetId: "WAVES"
                }
            }
        };
        this.state.wavesKeeper.signAndPublishTransaction(txData)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    onSendData = () => {
        /*const txData = {
            type: 12,
            recipient: '3N5GgjuPpQ6ihVyRGzYjs7xxm4oWeuMBPus',
            data: {
                recipient: '3N5GgjuPpQ6ihVyRGzYjs7xxm4oWeuMBPus',

                data: [
                    {
                        "key": "email",
                        "type": "string",
                        "value": "hello@g.com"
                    },
                    {
                        "key": "code_hash",
                        "type": "string",
                        "value": "----"
                    }
                ],
                fee: {
                    tokens: "0.01",
                    assetId: "WAVES"
                }
            }
        };*/
        const txData = {
            type: 4,
            data: {
                recipient: '3N5GgjuPpQ6ihVyRGzYjs7xxm4oWeuMBPus',

                amount: {
                    assetId: null,
                    tokens: 0.01
                },
                fee: {
                    tokens: "0.001",
                    assetId: "WAVES"
                }
            }
        };
        this.state.wavesKeeper.signAndPublishTransaction(txData)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        return (
            <Fragment>
                <div
                    className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
                    <h5 className="my-0 mr-md-auto font-weight-normal">Waves App</h5>
                </div>

                <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                    <h1 className="display-4">Waves Identity</h1>
                    <p className="lead">
                        Blockchain allows secure and immutable storage of personal data, making the technology eminently
                        suitable for identity management and verification. We suggest an identity management tool.
                    </p>
                </div>

                <div className="container">
                    <div className="d-flex justify-content-center">
                        {this.state.isLogged &&
                        <form action="" className="col-sm-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Waves Address</label>
                                <input type="text" className="form-control"
                                       disabled={true}
                                       placeholder="Waves Address"
                                       onChange={() => {
                                       }}
                                       value={this.state.address}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input type="email"
                                       className="form-control"
                                       aria-describedby="emailHelp"
                                       data-field="email"
                                       onChange={this.onChange}
                                       value={this.state.email}
                                       placeholder="Enter email"/>
                            </div>

                            <button className="btn btn-primary" onClick={this.onCheckEmail}>Verify</button>
                            &nbsp;
                            <button className="btn btn-secondary" onClick={this.onSendEmailVerification}>Send
                                verification
                            </button>
                            &nbsp;
                            <button className="btn btn-secondary" onClick={this.onSendData}>Send
                                data
                            </button>
                        </form>}

                        {!this.state.isLogged && <div>
                            <button
                                className="btn btn-primary"
                                disabled={!this.state.wavesKeeper}
                                onClick={this.onAuth}
                            >Login
                            </button>
                        </div>}
                    </div>


                    <footer className="pt-4 my-md-5 pt-md-5 border-top">
                        <div className="row">
                            <div className="col-12 col-md">

                                <small className="d-block mb-3 text-muted">&copy; 2019</small>
                            </div>
                        </div>
                    </footer>
                </div>

            </Fragment>);
    }
}

export default App;
