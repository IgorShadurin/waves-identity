import React, {Component, Fragment} from 'react';
import './App.css';

const {invokeScript, broadcast} = require('@waves/waves-transactions')

class App extends Component {
    constructor() {
        super();
        this.state = {
            wavesKeeper: window.WavesKeeper,
            isLogged: true,
            isVerificationSent: false,
            address: '',
            email: '',
            senderPublicKey: '',
            senderSeed: '',
            oracleAddress: '3N9UfhqeB5hRaKF9LvQrT3naVFJ8cPUAo1m',
            emailCode: '',
            toEmail: '',
            toAmount: '0.01',
            page: 'registration',
            chainId: 'T'
        };

        this.checkWavesKeeperInterval = setInterval(() => {
            if (window.WavesKeeper) {
                console.log(window.WavesKeeper);
                this.setState({wavesKeeper: window.WavesKeeper});
                clearInterval(this.checkWavesKeeperInterval);

                /*window.WavesKeeper.publicState()
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
                    });*/
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

    checkWallet = () => {
        if (!this.state.address) {
            alert('Address is empty');

            return false;
        }

        if (!this.state.senderSeed) {
            alert('Sender seed is empty');

            return false;
        }

        if (!this.state.senderPublicKey) {
            alert('Sender public key is empty');

            return false;
        }

        return true;
    };

    onSendData = () => {
        if (!this.checkWallet()) {
            return;
        }

        if (!this.state.email) {
            alert('Email is empty');

            return;
        }

        const txData = invokeScript({
            dappAddress: this.state.oracleAddress,
            call: {
                function: "emailPlease",
                args: [
                    {
                        type: "string", value: this.state.email
                    }
                ]
            },
            senderPublicKey: this.state.senderPublicKey.trim(),
            chainId: this.state.chainId,
        }, this.state.senderSeed.trim());


        const nodeUrl = 'https://testnodes.wavesnodes.com';
        broadcast(txData, nodeUrl)
            .then(resp => console.log(resp));
        this.setState({isVerificationSent: true});
    };

    onCheckCode = () => {
        if (!this.checkWallet()) {
            return;
        }

        if (!this.state.email) {
            alert('Email is empty');
            return;
        }

        if (!this.state.emailCode) {
            alert('Email code is empty');
            return;
        }

        const txData = invokeScript({
            dappAddress: this.state.oracleAddress,
            call: {
                function: "validateEmail",
                args: [
                    {
                        type: "string", value: this.state.email
                    },
                    {
                        type: "string", value: btoa(this.state.emailCode.trim())
                    },
                ]
            },
            senderPublicKey: this.state.senderPublicKey.trim(),
            chainId: this.state.chainId,
        }, this.state.senderSeed.trim());

        const nodeUrl = 'https://testnodes.wavesnodes.com';
        broadcast(txData, nodeUrl)
            .then(resp => {
                console.log(resp);
                alert('OK');
            })
            .catch(() => alert('Incorrect code. Try again'));
    };

    onSendByEmail = () => {
        if (!this.checkWallet()) {
            return;
        }

        if (!this.state.toEmail) {
            alert('Email is empty');
            return;
        }

        if (!this.state.toAmount) {
            alert('Amount is empty');
            return;
        }

        const txData = invokeScript({
            dappAddress: this.state.oracleAddress,
            call: {
                function: "payToEmail",
                args: [
                    {
                        type: "string", value: this.state.toEmail
                    },
                ]
            },
            payment: [{amount: this.state.toAmount * 100000000, asset: null}],
            senderPublicKey: this.state.senderPublicKey.trim(),
            chainId: this.state.chainId,
        }, this.state.senderSeed.trim());

        console.log(txData);

        const nodeUrl = 'https://testnodes.wavesnodes.com';
        broadcast(txData, nodeUrl)
            .then(resp => {
                console.log(resp);
                alert('Transaction complete');
            })
            .catch(() => alert('Email not verified or not enough balance'));
    };

    getNavClasses = (isActive) => {
        return `btn nav-item nav-link ${isActive ? 'active' : ''}`;
    };

    setPage(e, page) {
        e.preventDefault();
        this.setState({page});
    }

    render() {
        let page = <Fragment>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Send WAVES to Email</label>
                <input type="text"
                       className="form-control"
                       aria-describedby="emailHelp"
                       placeholder="Email"
                       onChange={this.onChange}
                       data-field="toEmail"
                       value={this.state.toEmail}
                />
            </div>

            <div className="form-group">
                <label htmlFor="exampleInputPassword1">WAVES Amount</label>
                <input type="text"
                       className="form-control"
                       placeholder="Amount"
                       onChange={this.onChange}
                       data-field="toAmount"
                       value={this.state.toAmount}/>
            </div>

            <button className="btn btn-primary" onClick={this.onSendByEmail}>Send</button>
        </Fragment>;

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
                        <div className="col-sm-6">
                            <nav className="nav nav-pills nav-justified">
                                <button
                                    //disabled={isRegistration}
                                    className={this.getNavClasses(this.state.page === 'registration')}
                                    onClick={(e) => this.setPage(e, 'registration')}>
                                    Registration
                                </button>
                                <button
                                    //disabled={isRegistration}
                                    className={this.getNavClasses(this.state.page === 'send')}
                                    onClick={(e) => this.setPage(e, 'send')}>
                                    Send by email
                                </button>
                            </nav>
                            <br/>

                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Waves Address</label>
                                <input type="text" className="form-control"
                                       placeholder="Waves Address"
                                       data-field="address"
                                       onChange={this.onChange}
                                       value={this.state.address}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Sender Public Key</label>
                                <input type="text" className="form-control"
                                       placeholder="Public Key"
                                       data-field="senderPublicKey"
                                       onChange={this.onChange}
                                       value={this.state.senderPublicKey}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Seed</label>
                                <input type="text" className="form-control"
                                       placeholder="Waves Address Seed"
                                       data-field="senderSeed"
                                       onChange={this.onChange}
                                       value={this.state.senderSeed}/>
                            </div>

                            {this.state.page === 'send' && page}

                            {this.state.page === 'registration' && this.state.isLogged && !this.state.isVerificationSent &&
                            <form action="" onSubmit={(e) => e.preventDefault()}>
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

                                <button className="btn btn-primary" onClick={this.onSendData}>
                                    Verify
                                </button>
                            </form>}

                            {this.state.page === 'registration' && this.state.isLogged && this.state.isVerificationSent &&
                            <form action="" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Code from email</label>
                                    <input type="text" className="form-control"
                                           placeholder="Code"
                                           data-field="emailCode"
                                           onChange={this.onChange}
                                           value={this.state.emailCode}/>
                                </div>

                                <button className="btn btn-primary" onClick={this.onCheckCode}>
                                    Check code
                                </button>
                            </form>}

                            {this.state.page === 'registration' && !this.state.isLogged && <div>
                                <button
                                    className="btn btn-primary"
                                    disabled={!this.state.wavesKeeper}
                                    onClick={this.onAuth}
                                >Login
                                </button>
                            </div>}
                        </div>
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
