import React, {useState, useEffect} from 'react';
import {
    DropdownMenu, UncontrolledDropdown, DropdownToggle, DropdownItem
} from 'reactstrap';
import {GITHUB_CLIENT_ID} from './../constants';

const storedAuthDetails = JSON.parse(localStorage.getItem('auth_details'));
if (storedAuthDetails && Date.now() > storedAuthDetails.expire) {
    localStorage.removeItem('auth_details');
}

const url = new URL(window.location.href);
const accessToken = url.searchParams.get('access_token');

function User () {
    const [user, setUser] = useState(storedAuthDetails ? storedAuthDetails.user : null);

    useEffect(() => {
        if (!user && accessToken) {
            window.history.replaceState(null, '', url.origin);

            // get the authenticated user
            fetch('https://api.github.com/user', {
                headers: {
                    Authorization: 'token ' + accessToken,
                    accept: 'application/json',
                }
            })
                .then(response => response.json())
                .then((user) => {
                    console.log(user);
                    setUser(user);
                    localStorage.setItem('auth_details', JSON.stringify({
                        expire: Date.now() + 1000 * 60 * 60,
                        user,
                        access_token: accessToken,
                    }));
                })
                .catch((e) => {
                    console.error(e);
                    alert('Authentication failed');
                });
        }

        // return function cleanup () {};
    }, []);

    const logOut = () => {
        localStorage.removeItem('auth_details');
        window.location.reload();
    };

    if (!user) {
        return (
            <a
                className="btn btn-link login" title="Login with GitHub"
                href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`}
            >
                <i className="fas fa-sign-in-alt"/> Login
            </a>
        );
    }
    return (
        <UncontrolledDropdown>
            <DropdownToggle color="link" className="avatar-btn" caret>
                <img alt={`Avatar of ${user.name}`} className="avatar-img" title={user.name}
                     src={`${user.avatar_url}`}/>
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem onClick={() => {}}>
                    <i className="fas fa-save"/> Save to Gist
                </DropdownItem>
                <DropdownItem onClick={() => {}}>
                    <i className="fas fa-cloud-download-alt"/> Load from Gist
                </DropdownItem>
                <DropdownItem onClick={logOut}>
                    <i className="fas fa-sign-out-alt"/> Logout
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    );
}

export default User;
