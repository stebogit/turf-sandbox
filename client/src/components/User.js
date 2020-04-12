import React, {useState, useEffect, useContext, useRef} from 'react';
import {DropdownMenu, UncontrolledDropdown, DropdownToggle, DropdownItem} from 'reactstrap';
import GistListModal from './GistListModal';
import {GITHUB_CLIENT_ID, url} from './../constants';
import {AppContext} from '../context';

let storedAuthDetails = JSON.parse(localStorage.getItem('auth_details'));
if (storedAuthDetails && Date.now() > storedAuthDetails.expire) {
    localStorage.removeItem('auth_details');
    storedAuthDetails = null;
}

function User () {
    const [user, setUser] = useState(storedAuthDetails ? storedAuthDetails.user : null);
    const [showListModal, setShowListModal] = useState(false);
    const {code} = useContext(AppContext);

    useEffect(() => {
        const accessToken = url.searchParams.get('access_token');

        if (!user && accessToken) {
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
                    setUser(user);
                    localStorage.setItem('auth_details', JSON.stringify({
                        expire: Date.now() + 1000 * 60 * 60,
                        user,
                        access_token: accessToken,
                    }));

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
    }, []);

    const logOut = () => {
        localStorage.removeItem('auth_details');
        window.location.reload();
    };

    const toggleListModal = () => setShowListModal(!showListModal);

    const saveGist = () => {
        fetch(`https://api.github.com/gists`, {
            method: 'POST',
            headers: {
                Authorization: 'token ' + storedAuthDetails.access_token,
                Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                description: 'turf-sandbox snippet',
                public: true,
                files: {
                    'script.turf-sandbox': {content: code},
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

    const logIn = () => {
        const gist = url.searchParams.get('gist');
        if (gist) localStorage.setItem('gist', gist);
        window.location = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=gist`
    };

    if (!user) {
        return (
            <button className="btn btn-link login" title="Login with GitHub" onClick={logIn}>
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
                    <DropdownItem onClick={saveGist}>
                        <i className="fas fa-save fa-fw"/> Save to Gist
                    </DropdownItem>
                    <DropdownItem onClick={toggleListModal}>
                        <i className="fas fa-cloud-download-alt fa-fw"/> Load from Gist
                    </DropdownItem>
                    <DropdownItem onClick={logOut}>
                        <i className="fas fa-sign-out-alt fa-fw"/> Logout
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>

            <GistListModal
                    show={showListModal}
                    onClose={toggleListModal}
                    username={user.login}
                    accessToken={storedAuthDetails.access_token}
                />
        </>
    );
}

export default User;
