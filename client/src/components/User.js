import React, {Component} from 'react';
import {DropdownMenu, UncontrolledDropdown, DropdownToggle, DropdownItem} from 'reactstrap';
import GistListModal from './GistListModal';
import {GITHUB_CLIENT_ID, url} from './../constants';
import AppContext from '../context';

let storedAuth = JSON.parse(localStorage.getItem('auth'));
if (storedAuth && Date.now() > storedAuth.expire) {
    localStorage.removeItem('auth_details');
    storedAuth = null;
}

class User extends Component {
    state = {
        user: storedAuth ? storedAuth.user : null,
        showListModal: false,
        accessToken: localStorage.getItem('access_token'),
    };

    static contextType = AppContext;

    componentDidMount () {
        if (!this.state.user && url.searchParams.has('access_token')) {
            const accessToken = url.searchParams.get('access_token');
            url.searchParams.delete('access_token');
            window.history.replaceState(null, '', url.origin + url.search);

            // get the authenticated user
            fetch('https://api.github.com/user', {
                headers: {
                    Authorization: 'token ' + accessToken,
                    Accept: 'application/json',
                }
            })
                .then(async (response) => {
                    if (response.status >= 400) throw new Error();

                    const user = await response.json();

                    localStorage.setItem('auth', JSON.stringify({
                        expire: Date.now() + 1000 * 60 * 60,
                        user,
                    }));
                    localStorage.setItem('access_token', accessToken);

                    this.setState({user, accessToken});

                    // GitHub will redirect the use to ta standard url set when registering the app
                    // here we restore the `gits` param if it was set at login
                    const gist = localStorage.getItem('gist');
                    if (gist) {
                        localStorage.removeItem('gist');
                        url.searchParams.set('gist', gist);
                        window.location = url.origin + url.search;
                    }
                })
                .catch((e) => {
                    console.error(e);
                    alert('Authentication failed');
                });
        }
    }

    saveGist = () => {
        fetch(`https://api.github.com/gists`, {
            method: 'POST',
            headers: {
                Authorization: 'token ' + this.state.accessToken,
                Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                description: 'turf-sandbox snippet',
                public: true,
                files: {
                    'script.turf-sandbox': {content: this.context.code},
                }
            }),
        })
            .then(async (response) => {
                if (response.status >= 400) throw new Error();

                const result = await response.json();
                alert('Saved at ' + result.html_url);
            })
            .catch((e) => {
                console.error(e);
                alert('Sorry, an error occurred while saving your gist.');
            });
    };

    logIn = () => {
        const gist = url.searchParams.get('gist');
        // save gist reference for after login
        if (gist) localStorage.setItem('gist', gist);
        window.location = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=gist`;
    };

    logOut = () => {
        localStorage.removeItem('auth');
        localStorage.removeItem('access_token');
        window.location.reload();
    };

    toggleListModal = () => this.setState(s => ({showListModal: !s.showListModal }));

    render () {
        const {user, showListModal} = this.state;

        if (!user) {
            return (
                <button className="btn btn-link login" title="Login with GitHub" onClick={this.logIn}>
                    <i className="fas fa-sign-in-alt"/> Login
                </button>
            );
        }

        return (
            <>
                <UncontrolledDropdown>
                    <DropdownToggle color="link" className="avatar-btn" caret>
                        <img alt={`Avatar of ${user.name}`} className="avatar-img" title={user.name}
                             src={`${user.avatar_url}`}/>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem onClick={this.saveGist}>
                            <i className="fas fa-save fa-fw"/> Save to Gist
                        </DropdownItem>
                        <DropdownItem onClick={this.toggleListModal}>
                            <i className="fas fa-cloud-download-alt fa-fw"/> Load from Gist
                        </DropdownItem>
                        <DropdownItem onClick={this.logOut}>
                            <i className="fas fa-sign-out-alt fa-fw"/> Logout
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                {showListModal &&
                    <GistListModal
                        show
                        onLoadGist
                        onClose={this.toggleListModal}
                        username={user.login}
                    />}
            </>
        );
    }
}

export default User;
